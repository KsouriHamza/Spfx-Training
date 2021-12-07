import * as React from 'react';
import styles from './Datatable.module.scss';
import { IDatatableProps } from './IDatatableProps';
import { InjectAutoInit, PropertyInject } from '../../../spfx-di-wrapper';
import { mainContainer, TYPES } from '../../../shared/config-di/inversify.config';
import { IHistoryService } from '../../../shared/services/HistoryService/IHistoryService';
import { IDatatableStates } from './IDatatableStates';
import "reflect-metadata";
import { DetailsList, DetailsListLayoutMode, DetailsRow, IColumn, Icon, IDetailsListProps, IDetailsRowStyles, Label, SelectionMode, TextField } from 'office-ui-fabric-react';
import { enablePagination, enableSearching, enableSorting, evenRowColor, fieldWithIcon, filterDateBy, oddRowColor, searchBy, sortBy } from '../../../shared/models/HistoryConsts';
import Pagination from './Pagination/Pagination';
import { Grid } from '@material-ui/core';
import FilterDate from './FilterDate/FilterDate';


@InjectAutoInit
export default class Datatable extends React.Component<IDatatableProps, IDatatableStates> {

  @PropertyInject({
    typeKey: TYPES.HistoryService,
    container: mainContainer.Container
  })
  private historyService: IHistoryService;

  private fields: any[];

  constructor(props: IDatatableProps) {
    super(props);
    this.state = {
      listItems: [],
      columns: [],
      page: 1,
      searchText: '',
      rowsPerPage: 10,
      sortingFields: '',
      sortDirection: 'asc',
      contentType: '',
      pageOfItems: [],
      filterNumber: -1,
      filterSystem: ''
    };
  }

  //#region Cycle de vie composant

  /**
  * Recuperation des données au chargement de la composante 
  *  */
  public async componentDidMount() {
    await this.renderHistoryData();
  }

  //#endregion
  //#region Fonctions utilitaire

  private handlePaginationChange(pageNo: number, rowsPerPage: number) {
    this.setState({ page: pageNo, rowsPerPage: rowsPerPage });
  }

  private renderHistoryData = async () => {

    let itemsFiels: any[] = await this.historyService.getHistoryFields();
    this.fields = itemsFiels;
    if (itemsFiels.length) {
      let items = await this.historyService.getHistoryItems();

      items = items && items.map(item => ({
        id: item.Id, ...itemsFiels.reduce((ob, f) => {
          ob[f.key] = item[f.key] ? this.formatColumnValue(item[f.key], f.fieldType, f.key) : '-';
          return ob;
        }, {})
      }));

      let dataGridColumns: IColumn[] = [...itemsFiels].map(f => ({
        key: f.key as string,
        name: f.text,
        fieldName: f.key as string,
        isResizable: true,
        onColumnClick: sortBy && sortBy.filter(field => field === f.key).length ? this.handleSorting(f.key as string) : undefined,
        minWidth: 70,
        maxWidth: 100,
        headerClassName: styles.colHeader
      }));

      this.setState({ listItems: items, columns: dataGridColumns });
    }
  }

  public formatColumnValue(value: any, type: string, field: string) {
    if (!value) {
      return value;
    }
    switch (type) {
      case 'SP.FieldDateTime':
        value = value;
        break;
      case 'SP.FieldChoice':
        value = field === fieldWithIcon ? this.renderIconFromValue(value) : value
        break;
      case 'SP.FieldMultiChoice':
        value = (value instanceof Array) ? value.join() : value;
        break;
      case 'SP.FieldLookup':
        value = value['Title'];
        break;
      case 'SP.FieldMultiLineText':
        value = <div dangerouslySetInnerHTML={{ __html: value }}></div>;
        break;
      case 'SP.FieldText':
        value = value;
        break;
      case 'SP.FieldComputed':
        value = value;
        break;
      default:
        break;
    }
    return value;


  }

  private handleSorting = (property: string) => (event: React.MouseEvent<unknown>, column: IColumn) => {
    property = column.key;
    let { sortingFields, sortDirection } = this.state;
    const isAsc = sortingFields && sortingFields === property && sortDirection === 'asc';
    let updateColumns = this.state.columns.map(c => {
      return c.key === property ? { ...c, isSorted: true, isSortedDescending: (isAsc ? false : true) } : { ...c, isSorted: false, isSortedDescending: true };
    });
    this.setState({ sortDirection: (isAsc ? 'desc' : 'asc'), sortingFields: property, columns: updateColumns });
  }

  public handleSearch(event: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ searchText: event.target.value });
  }

  public filterListItems() {
    // recuperation des états
    let { sortingFields, listItems, searchText, filterNumber } = this.state;
    // mise a jour Filtre Date
    let maxDate = new Date();
    let minDate = new Date();
    minDate.setDate(minDate.getDate() - filterNumber);


    if (searchText) {
      if (searchBy) {
        listItems = listItems && listItems.length && listItems
          .filter(l => searchBy
            .some(field => {
              return (l[field]
                && l[field].toString().toLowerCase().includes(searchText.toLowerCase()));
            }));
      }
    }

    if (filterNumber !== -1) {
      listItems = listItems && listItems.length && listItems
        .filter(l => {
          return l[filterDateBy]
            && new Date(l[filterDateBy]).getTime() >= minDate.getTime()
            && new Date(l[filterDateBy]).getTime() <= maxDate.getTime()
        });
    }
    if (enableSorting && sortingFields) {
      listItems = this.sortListItems(listItems);
    }


    return listItems;
  }

  private sortListItems(listItems: any[]) {
    const { sortingFields, sortDirection } = this.state;
    const isAsc = sortDirection === 'asc' ? 1 : -1;
    let sortFieldDetails = this.fields.filter(f => f.key === sortingFields)[0];
    let sortFn: (a, b) => number;
    switch (sortFieldDetails.fieldType) {
      case 'SP.FieldDateTime':
        sortFn = (a, b) => ((new Date(a[sortingFields]).getTime() > new Date(b[sortingFields]).getTime()) ? 1 : -1) * isAsc;
        break;
      default:
        sortFn = (a, b) => ((a[sortingFields] > b[sortingFields]) ? 1 : -1) * isAsc;
        break;
    }
    listItems.sort(sortFn);
    return listItems;
  }

  private paginateFn = (filterItem: any[]) => {
    let { rowsPerPage, page } = this.state;
    return (rowsPerPage > 0
      ? filterItem.slice((page - 1) * rowsPerPage, (page - 1) * rowsPerPage + rowsPerPage)
      : filterItem
    );
  }

  private _onRenderRow: IDetailsListProps['onRenderRow'] = props => {
    const customStyles: Partial<IDetailsRowStyles> = {};
    if (props) {
      if (props.itemIndex % 2 === 0) {
        customStyles.root = { backgroundColor: evenRowColor };
      }
      else {
        customStyles.root = { backgroundColor: oddRowColor };
      }
      return <DetailsRow {...props} styles={customStyles} />;
    }
    return null;
  }

  private onChangeFilterDate = (nbDays) => {
    this.setState({
      filterNumber: nbDays
    })
  }

  private renderIconFromValue = (value: string): JSX.Element => {

    let iconName, iconColor, iconsize: any
    switch (value) {
      case 'C':
        iconName = "StatusErrorFull";
        iconsize = "1.5em";
        iconColor = "#cc0000";
        break;
      case 'L':
        iconName = "StatusErrorFull";
        iconsize = "1.5em";
        iconColor = "#cc0000";
        break;

      default:
        iconName = "IncidentTriangle";
        iconsize = "1.5em";
        iconColor = "#dd9900";
        break;
    }

    return (
      <div className="dropdownFilterDate-placeholder">
        <Icon style={{ color: iconColor, fontSize: iconsize, marginRight: '5px' }} iconName={iconName} aria-hidden="true" />
      </div>
    )
  };

  //#endregion


  public render(): React.ReactElement<IDatatableProps> {

    let filteredItems = this.filterListItems();
    let { columns } = this.state;
    let filteredPageItems = enablePagination ? this.paginateFn(filteredItems) : filteredItems;

    return (
      <div>
        <Grid container spacing={2}>
          <Grid item xs>
            <Label> {filteredItems.length} Incident(s)</Label>
          </Grid>
          <Grid item xs={6}>
            {enableSearching ?
              <TextField
                onChange={this.handleSearch.bind(this)}
                placeholder="Rechercher"
                className={styles.txtSearchBox} />
              : <></>}
          </Grid>
          <Grid item xs>
            <FilterDate onChange={this.onChangeFilterDate} />
            {/* <button onClick={this.updateDate}>UpdateDate</button>
            <button onClick={this.clearDate}>Clear</button>  */}
          </Grid>
        </Grid>
        <div id="generateTable">
          <DetailsList
            items={filteredPageItems}
            columns={columns}
            selectionMode={SelectionMode.none}
            layoutMode={DetailsListLayoutMode.justified}
            isHeaderVisible={true}
            onRenderRow={this._onRenderRow}
          />
          <div>
            {enablePagination ?
              <Pagination
                currentPage={this.state.page}
                totalItems={filteredItems.length}
                onChange={this.handlePaginationChange.bind(this)}
              />
              : <></>}
          </div>
        </div>
      </div>
    );
  }
}
