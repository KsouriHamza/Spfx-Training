import { Dropdown, Icon, IconButton, IDropdownOption, IDropdownProps, Label, Stack } from "office-ui-fabric-react";
import * as React from "react";

const filterDateOptions: IDropdownOption[] = [
    { key: -1, text: 'Effacer le filtre ', data: { icon: 'Calendar' } },
    { key: 7, text: '7 derniers jours', data: { icon: 'Calendar' } },
    { key: 15, text: '15 derniers jours', data: { icon: 'Calendar' } },
    { key: 30, text: '30 derniers jours', data: { icon: 'Calendar' } },
    { key: 60, text: '60 derniers jours', data: { icon: 'Calendar' } }
];

const iconStyles = { marginRight: '8px' };

export interface IFilterDateProps {
    onChange: (nbDays: number) => void;
}

export interface IFilterDateState {
}
export default class FilterDate extends React.Component<IFilterDateProps, IFilterDateState> {
    constructor(props: Readonly<IFilterDateProps>) {
        super(props);
        this.state = {

        };
    }

    private onRenderOption = (option: IDropdownOption): JSX.Element => {
        return (
            <div>
                {option.data && option.data.icon && (
                    <Icon style={iconStyles} iconName={option.data.icon} aria-hidden="true" title={option.data.icon} />
                )}
                <span>{option.text}</span>
            </div>
        );
    };

    private onRenderTitle = (options: IDropdownOption[]): JSX.Element => {
        const option = options[0];
        return (
            <div>
                {option.data && option.data.icon && (
                    <Icon style={iconStyles} iconName={option.data.icon} aria-hidden="true" title={option.data.icon} />
                )}
                <span>{option.key === -1 ? "Filter par date" :option.text}</span>
            </div>
        );
    };

    private onRenderCaretDown = (): JSX.Element => {
        return <></>;
    };

    private onRenderPlaceholder = (props: IDropdownProps): JSX.Element => {
        return (
            <div className="dropdownFilterDate-placeholder">
                <Icon style={iconStyles} iconName={'Calendar'} aria-hidden="true" />
                <span>{props.placeholder}</span>
            </div>
        );
    };

    public componentDidMount() {

    }
    public componentDidUpdate(prevProps: IFilterDateProps) {

    }

    public render(): React.ReactElement<IFilterDateProps> {
        return (
            <Dropdown
            styles={{
                title: {
                  border: 0,
                }
              }}
                placeholder="Filter par date"               
                onRenderPlaceholder={this.onRenderPlaceholder}
                onRenderTitle={this.onRenderTitle}
                onRenderOption={this.onRenderOption}
                onRenderCaretDown={this.onRenderCaretDown}
                options={filterDateOptions}
                onChange={(e, selectedOption) => {
                    this.props.onChange(parseInt(selectedOption.key.toString()))
                }}
            />
        );
    }

}