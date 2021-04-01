import { Table,  Button, Icon } from "semantic-ui-react";
const _key = "orders";
const TableRowKeyId = "OrderID";

export default function OrderList(props) {
  //console.log("====>", props);
  let orderData = (props && props[_key]) || [];
  let tableComponent = "Loading...";

  if (orderData.length > 0) {
    tableComponent = (
      <Table>
        <Table.Header>
          <Table.Row>          
            {renderTableHeader(orderData)}
            <Table.HeaderCell> Complete Delivery </Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>{renderTableData(orderData, props.onHandleDelivery)}</Table.Body>
      </Table>
    );
  }

  return <div>{tableComponent}</div>;
}

function renderTableData(tableData, handleClick) {
  let col = Object.keys(tableData[0]); // this can be defined before the map
  return tableData.map((record) => {
    return (
      <Table.Row key={record[TableRowKeyId]} >
        {col.map((val, index) => {
          // conditional insertion
          return <Table.Cell key={index}>{record[val] || ""}</Table.Cell>;
        })}
        <Table.Cell collapsing>
          <Button onClick={() => { handleClick(record) }}><Icon name="camera"/> </Button>
        </Table.Cell>
      </Table.Row>
    );
  });
}

function renderTableHeader(tableData) {
  let header = Object.keys(tableData[0]);
  return header.map((key, index) => {
    return <Table.HeaderCell key={index}>{key.toUpperCase()}</Table.HeaderCell>;
  });
}
