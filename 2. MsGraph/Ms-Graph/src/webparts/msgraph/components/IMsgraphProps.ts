import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface IMsgraphProps {
  description: string;
  // Passer le WP context au composant dans les props 
  context: WebPartContext

}
