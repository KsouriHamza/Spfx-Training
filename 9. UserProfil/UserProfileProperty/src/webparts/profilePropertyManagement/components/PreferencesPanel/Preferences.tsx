import * as React from 'react';
import { IPreferencesProps } from './IPreferencesProps';
import { IPreferencesStates, ICheckBoxItemUI } from './IPreferencesStates';
import { Panel } from 'office-ui-fabric-react/lib/Panel';
import { DefaultButton, PrimaryButton } from 'office-ui-fabric-react/lib/Button';
import { attachServiceScope } from '../common/attachServiceScope';
import { sp } from "@pnp/sp";
import { PageContext } from "@microsoft/sp-page-context";
import { FactoryOp } from '../services/FactoryOp';
import { ISystemItem } from '../models/ISystemItem';
import { Checkbox, IBasePickerSuggestionsProps, ITag, MessageBar, PanelType, Stack, TagPicker } from '@fluentui/react';
import { Chip, Divider } from '@material-ui/core';
import { Label } from '@microsoft/office-ui-fabric-react-bundle';

// Stock configuration
const stackTokens = { childrenGap: 10 };
const itemStyles: React.CSSProperties = {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center'

};

// Autocomplite Picker configuration
const pickerSuggestionsProps: IBasePickerSuggestionsProps = {
    suggestionsHeaderText: "Proposition de système",
    noResultsFoundText: "Aucun système n'a été trouvé",
};

class ProfilePropertyManagement extends React.Component<IPreferencesProps, IPreferencesStates> {

    // liste des tag de recherche
    listTags: ITag[] = [];

    // Section contructeur 
    constructor(props: IPreferencesProps) {
        super(props);
        // Initialisation des etats
        this.state = {
            isOpen: true,
            keySearch: false,
            listSystem: [],
            listFiltredSystem: [],
            notifMessage: "",
            showmessageBar: false
        }

        // Setup SP with ServiceScoop
        sp.setup({
            spfxContext: {
                pageContext: this.props.serviceScope.consume(PageContext.serviceKey)
            }
        });
    }

    // Fonction de fermuture de la panel
    public render(): React.ReactElement<IPreferencesProps> {
        let buttonStyles = { root: { marginRight: 8 } };
        const onRenderFooterContent = () => (
            <div>
                {this.state.showmessageBar &&
                    <MessageBar onDismiss={() => this.setState({ showmessageBar: false })} dismissButtonAriaLabel="Fermer">
                        {this.state.notifMessage}
                    </MessageBar>}
                <br />
                <PrimaryButton onClick={this._saveclick} styles={buttonStyles}>
                    Enregistrer
                </PrimaryButton>
                <DefaultButton onClick={this._onDismiss}>Annuler</DefaultButton>
            </div>
        );

        return (
            <div>
                <Panel
                    headerText={"Mes préférences systèmes"}
                    isOpen={this.state.isOpen}
                    type= {PanelType.medium}
                    onDismiss={this._onDismiss}
                    isBlocking={false}
                    closeButtonAriaLabel="Fermer"
                    allowTouchBodyScroll={true}
                    onRenderFooterContent={onRenderFooterContent}
                    isFooterAtBottom={true}>

                    <div className="bodymain">
                        <br />
                        <div >
                            <TagPicker
                                removeButtonAriaLabel="Supprimer"
                                selectionAriaLabel="Selectionner les systèmes"
                                onResolveSuggestions={this.filterSuggestedTags}
                                getTextFromItem={this.getTextFromItem}
                                pickerSuggestionsProps={pickerSuggestionsProps}
                                itemLimit={10}
                                // this option tells the picker's callout to render inline instead of in a new layer
                                pickerCalloutProps={{ doNotLayer: true }}
                                inputProps={{ id: this.pickerId, }}
                                onChange={this._onChangePickerTags.bind(this) }
                            />
                        </div>

                        <br />
                        <Stack horizontal horizontalAlign="space-between" >
                            <Stack.Item style={itemStyles} >
                                <Label >Mes choix </Label>
                            </Stack.Item>
                            <Stack.Item style={itemStyles} >
                                <Chip variant="default" size="small" color="primary" label={this.state.listSystem.filter(el => el.sysIsChecked === true).length} />
                            </Stack.Item>
                        </Stack>

                        <Divider variant="fullWidth" />
                        <br />
                        {this._renderCheckBoxListSelected(this.state.keySearch ? this.state.listFiltredSystem : this.state.listSystem)}
                        <br />
                        <Stack horizontal horizontalAlign="space-between">
                            <Stack.Item style={itemStyles}>
                                <Label >Tous les systèmes </Label>
                            </Stack.Item>
                            <Stack.Item style={itemStyles}>
                                <Chip variant="default" size="small" color="primary" label={this.state.listSystem.filter(el => el.sysIsChecked === false).length} />
                            </Stack.Item>
                        </Stack>
                        <Divider variant="fullWidth" />
                        <br />
                        {this._renderCheckBoxList(this.state.keySearch ? this.state.listFiltredSystem : this.state.listSystem)}
                        <br />

                    </div>


                </Panel>
            </div>
        );
    }

    // Recuperation des données au chargement de la composante 
    public async componentDidMount() {
        // Recuperation de la liste des systemes
        await this._readData();
    }

    // Persistance
    private _saveclick = async () => {
        let msgSuccess = "Tous vos préférences ont été enregistrées avec succès, veuillez rafraîchir la page pour voir le résultat"
        let messageErreur = "Une erreur est survenue lors de l'enregistrement de vos préférences"
        try {
            let factory: FactoryOp = new FactoryOp();
            await factory.setUserProfileProperty("InfoCst-SysPref2", this.state.listSystem.filter(el => el.sysIsChecked === true).map(el => el.id).join(","))
            this.setState({
                notifMessage: msgSuccess,
                showmessageBar: true
            })
        } catch (error) {
            console.log(error);
            this.setState({
                notifMessage: messageErreur,
                showmessageBar: true
            })
        }


    }

    private _cancelclick = () => { }
    private _onDismiss = () => {
        this.setState({
            isOpen: false
        })
    }

    private _readData = async () => {
        let messageErreur = "Une erreur est survenue lors de la récupération des données";

        try {
            // Fabrique persistance
            let factory: FactoryOp = new FactoryOp();
            // Recuperation des donmées depuis la liste SP
            let listSys: ISystemItem[] = await factory.getAllSystemFromList("INFOSYS");
            // Recuperation de la liste des IDS systeme perference
            let listSysPreferencesIds: any[] = (await factory.getCurrentUserProfileValue("InfoCst-SysPref2")).split(",");

            // Construire L'etat
            let listSysUI: ICheckBoxItemUI[] = listSys.map((item) => {

                let systenUi: ICheckBoxItemUI = {
                    id: item.id,
                    systemName: item.SysName,
                    sysIsChecked: listSysPreferencesIds.indexOf(item.id.toString()) !== -1
                }
                return systenUi;
            })
            // Construire la table de recherche
            this.listTags = listSysUI.map(item => ({ key: item.id, name: item.systemName }));

            // Mise a jour de l'etat
            this.setState({
                listSystem: listSysUI
            });
        } catch (error) {
            console.log(error);
            this.setState({
                notifMessage: messageErreur,
                showmessageBar: true
            })
        }

    }

    private _renderCheckBoxList = (options: ICheckBoxItemUI[]) => (
        // onChange={this._onChange}
        options.filter(item => item.sysIsChecked === false).map((checkBoxItem: ICheckBoxItemUI) => {
            return (
                <Stack tokens={stackTokens}>
                    <Checkbox label={checkBoxItem.systemName} checked={checkBoxItem.sysIsChecked} onChange={this._onChange.bind(this)} ariaDescribedBy={checkBoxItem.id} />
                    <span></span>
                </Stack>
            );
        })
    )

    private _renderCheckBoxListSelected = (options: ICheckBoxItemUI[]) => (
        options.filter(item => item.sysIsChecked === true).map((checkBoxItem: ICheckBoxItemUI) => {
            return (
                <Stack tokens={stackTokens}>
                    <Checkbox label={checkBoxItem.systemName} checked={checkBoxItem.sysIsChecked} onChange={this._onChange.bind(this)} ariaDescribedBy={checkBoxItem.id} />
                    <span></span>
                </Stack>
            );
        })
    )

    private _onChange(ev: React.FormEvent<HTMLInputElement>, isChecked: boolean) {

        let currentId = ev.currentTarget.getAttribute('aria-describedby');
        console.log(currentId);

        //let newListSystemState = this.state.listSystem.map( el => (el.id.toString() === currentId.toString() ? { el.sysIsChecked =isChecked} : el ));
        var listSysTemp = this.state.listSystem;
        listSysTemp.map(el => {
            if (el.id.toString() === currentId.toString()) {
                el.sysIsChecked = isChecked;
            }
        });
        var listFiltredSystemTemp = this.state.listFiltredSystem;
        listFiltredSystemTemp.map(el => {
            if (el.id.toString() === currentId.toString()) {
                el.sysIsChecked = isChecked;
            }
        });

        this.setState({ listSystem: listSysTemp, listFiltredSystem: listFiltredSystemTemp });
    }

    // Section Configuration Picker
    private listContainsTagList = (tag: ITag, tagList?: ITag[]) => {
        if (!tagList || !tagList.length || tagList.length === 0) {
            return false;
        }
        return tagList.some(compareTag => compareTag.key === tag.key);
    };

    private filterSuggestedTags = (filterText: string, tagList: ITag[]): ITag[] => {
        return filterText
            ? this.listTags.filter(
                tag => tag.name.toLowerCase().indexOf(filterText.toLowerCase()) === 0 && !this.listContainsTagList(tag, tagList),
            )
            : [];
    };

    private getTextFromItem = (item: ITag) => item.name;
    private pickerId = "inline-picker-1515";

    private _onChangePickerTags(tagList: { key: string, name: string }[]) {
        if (tagList && tagList.length >= 1) {
            let newSysTableFiltr: ICheckBoxItemUI[] = [];
            tagList.map(el => {
                newSysTableFiltr.push({
                    id: el.key,
                    systemName: el.name,
                    sysIsChecked: this.state.listSystem.filter(a => a.id === el.key)[0].sysIsChecked,
                })
            });

            this.setState({
                keySearch: true,
                listFiltredSystem : newSysTableFiltr
            });
        } else {
            this.setState({
                keySearch: false
            });
        }
    }
}
export default attachServiceScope(ProfilePropertyManagement);