import * as React from 'react';
import { Panel, PanelType } from 'office-ui-fabric-react/lib/Panel';
import * as AdaptiveCards from "adaptivecards";


export interface IUserProfilePanelProps {
    isOpen: boolean;
    node: any
    onClosePanel: () => void;
}


export class UserProfilePanel extends React.Component<IUserProfilePanelProps, {}> {

    private card: any;
    private renderedCard: any = "";

    // Section contructeur 
    constructor(props: IUserProfilePanelProps) {
        super(props);
    }

    private _renderCard = (): any => {
        const { node } = this.props;

        this.card = {
            "type": "AdaptiveCard",
            "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
            "version": "1.5",
            "body": [
                {
                    "type": "ColumnSet",
                    "columns": [
                        {
                            "type": "Column",
                            "items": [
                                {
                                    "type": "Image",
                                    "style": "Person",
                                    "url": node.imageUrl,
                                    "width": "75px",
                                    "height": "75px",
                                    "horizontalAlignment": "Center"
                                },
                                {
                                    "type": "TextBlock",
                                    "weight": "Bolder",
                                    "text": node.name,
                                    "wrap": true,
                                    "horizontalAlignment": "Center",

                                    "isSubtle": false
                                },
                                {
                                    "type": "TextBlock",
                                    "spacing": "None",
                                    "text": node.positionName,
                                    "isSubtle": false,
                                    "wrap": true,
                                    "horizontalAlignment": "Center"

                                }
                            ],
                            "width": "stretch"
                        }
                    ],
                    "style": "emphasis"
                },
                {
                    "type": "ColumnSet",
                    "columns": [
                        {
                            "type": "Column",
                            "width": "stretch",
                            "items": [
                                {
                                    "type": "TextBlock",
                                    "text": "Informations du contact",
                                    "wrap": true,
                                    "weight": "Bolder",
                                    "horizontalAlignment": "Center",
                                    "spacing": "None"
                                }
                            ],
                            "horizontalAlignment": "Left",
                            "separator": true,
                            "style": "accent"
                        }
                    ]
                },
                {
                    "type": "FactSet",
                    "spacing": "Small",
                    "facts": [
                        {
                            "title": "Prénom :",
                            "value": "Test"
                        },
                        {
                            "title": "Nom :",
                            "value": "Value 2"
                        },
                        {
                            "title": "Nom utilisateur :",
                            "value": "Value 2"
                        },
                        {             
                            "title": "Courriel :",
                            "value": "Value 2"
                        }
                    ]
                },
                {
                    "type": "ColumnSet",
                    "columns": [
                        {
                            "type": "Column",
                            "width": "stretch",
                            "items": [
                                {
                                    "type": "TextBlock",
                                    "text": "Informations corporatives",
                                    "wrap": true,
                                    "weight": "Bolder",
                                    "horizontalAlignment": "Center",
                                    "spacing": "None"
                                }
                            ],
                            "style": "accent"
                        }
                    ]
                },
                {
                    "type": "FactSet",
                    "spacing": "Small",
                    "facts": [
                        {
                            "title": "Direction générale :",
                            "value": "Value 1"
                        },
                        {
                            "title": "Unité administrative :",
                            "value": "Value 2"
                        },
                        {
                            "title": "Centre de responsabilité :",
                            "value": "Value 2"
                        },
                        {
                            "title": "Responsable :",
                            "value": "Value 2"
                        },
                        {
                                      
                            "title": "Intérim :",
                            "value": "Value 2"
                        }
                    ]
                },
                {
                    "type": "ColumnSet",
                    "columns": [
                        {
                            "type": "Column",
                            "width": "stretch",
                            "items": [
                                {
                                    "type": "TextBlock",
                                    "text": "Coordonnées professionnelles",
                                    "wrap": true,
                                    "weight": "Bolder"
                                }
                            ],
                            "style": "accent",
                            "horizontalAlignment": "Center"
                        }
                    ]
                },
                {
                    "type": "FactSet",
                    "spacing": "Small",
                    "facts": [
                        {
                            "title": "Téléphones (bureau) :",
                            "value": "Value 1"
                        },
                        {
                            "title": "Téléphones (autre) :",
                            "value": "Value 2"
                        },
                        {
                            "title": "Adresse :",
                            "value": "Value 2"
                        },
                        {
                            "title": "Emplacement :",
                            "value": "Value 2"
                        }
                    ]
                }
            ]

        };
    }

    // Fonction de fermuture de la panel
    public render(): React.ReactElement<IUserProfilePanelProps> {

        let { isOpen } = this.props;
        this._renderCard();
        var adaptiveCard = new AdaptiveCards.AdaptiveCard();
        // Parse the card
        adaptiveCard.parse(this.card);
        // Render the card to an HTML element
        this.renderedCard = adaptiveCard.render();

        return (
            <div>
                <Panel
                    isOpen={isOpen}
                    type={PanelType.medium}
                    onDismiss={this._onDismiss}
                    isBlocking={false}
                    closeButtonAriaLabel="Fermer"
                    allowTouchBodyScroll={true} >

                    <div className="bodymain">
                        <br />
                        <div ref={(n) => { n && n.appendChild(this.renderedCard) }} />
                        <br />
                    </div>
                </Panel>
            </div>
        );
    }

    // 
    public async componentDidMount() {
        console.log("Mount");

    }

    private _onDismiss = () => {
        this.props.onClosePanel();
    }

}