var panelInstance = (
    <Panel collapsable header="Panel heading" expanded={true}>
      Some default panel content here.
      <ListGroup fill>
        <ListGroupItem>Item 1</ListGroupItem>
        <ListGroupItem>Item 2</ListGroupItem>
        <ListGroupItem>&hellip;</ListGroupItem>
      </ListGroup>
      Some more panel content here.
    </Panel>
  );

React.render(panelInstance, mountNode);
