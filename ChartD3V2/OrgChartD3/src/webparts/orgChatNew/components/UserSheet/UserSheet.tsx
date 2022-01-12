import {  getInitials, IPersona, IPersonaProps, Text, Persona, PersonaSize, ITextProps, Stack, Separator,  IStackStyles, IconButton, IIconProps,  ISeparatorStyles } from 'office-ui-fabric-react';
import * as React from 'react';
import styles from './UserSheet.module.scss';

export interface IUserSheetProps {
  node: any;
  styleIsSmall: boolean;
  isCalloutVisible: boolean;
}


//const wrapStackTokens: IStackTokens = { childrenGap: 10 };
const stackStyles: IStackStyles = {
  root: {
    width: '100%',
  },
};
const sperStyles: ISeparatorStyles = {
  root: {
    height: '10px',
    selectors: {
      '::before': {
        height: '2px'
      }
    }
  },
  content: {
    height: '4px'
  }
};
const teamsIcon: IIconProps = { iconName: 'teamslogo' };
const mailIcon: IIconProps = { iconName: 'mail' };
const contactinfoIcon: IIconProps = { iconName: 'contactinfo' };
const markCurrent: IIconProps = { iconName: 'Bullseye' };

export default class UserSheet extends React.Component<IUserSheetProps, {}> {

  private _persona: IPersona;
  private buttonId: any

  constructor(props) {
    super(props);
    this._persona = {
      imageInitials: getInitials(this.props.node.name, false),
      text: this.props.node.name,
      secondaryText: this.props.node.positionName,
      tertiaryText: this.props.node.office
      // "Hamza Ksouri ben Mohamed habib khayati ben ahmed ben naser ksouri"
    };

  }
  _onRenderText(props: IPersonaProps) {
    let variant = props.text.length > 20 ? "medium" : "xSmall"
    return <Text variant={variant as ITextProps['variant']}>{props.text}</Text>
  }
  _onRenderSecondaryText(props: IPersonaProps) {
    // return (
    //props.text.length < 19 ?  <Label>{props.text} </Label> : <TextField multiline> {props.text} </TextField>
    // <Text className={styles.TextPersona}> {props.text} </Text> hospital
    //);
  }

  public render(): React.ReactElement<IUserSheetProps> {

    const idCurrentNode = this.props.node.id
    return (
      <div id={this.buttonId} className={this.props.styleIsSmall ? styles.nodeBase : styles.nodeBig} data-action="actioncontainer" data-nodeid={idCurrentNode}>
        <div className={styles.nodeContainer} >
          <Stack>
            <Stack>
              <Persona
                {...this._persona}
                size={this.props.styleIsSmall ? PersonaSize.size72 : PersonaSize.size72}
                hidePersonaDetails={this.props.styleIsSmall}
                imageUrl={this.props.node.imageUrl}
                imageShouldStartVisible={true}
              />
            </Stack>
            <Stack>
              <Separator styles={sperStyles} />
            </Stack>
            <Stack>
              <Stack horizontal wrap styles={stackStyles}  >
                <IconButton href="mailto:alton.lafferty@outlook.com" target="_blank" iconProps={mailIcon} title="Envoyer un mail" ariaLabel="Envoyer un mail" />
                <IconButton href="https://teams.microsoft.com/l/chat/0/0?users=pattif@ksoham.onmicrosoft.com" target="_blank" iconProps={teamsIcon} title="Démarrer une conversation dans teams" ariaLabel="Démarrer une conversation dans teams" />
                <IconButton data-action="userProfile" iconProps={contactinfoIcon} title="Afficher le profile" ariaLabel="Afficher le profile" />
                <IconButton data-action="markUser" iconProps={markCurrent} title="Marquer l'utilisateur" ariaLabel="Marquer l'utilisateur" />
              </Stack>
            </Stack>
          </Stack>
        </div>
      </div>
    );
  }
}