var CollapsablePanel = React.createClass({
  mixins: [CollapsableMixin],

  propTypes: {
    expanded: React.PropTypes.bool,
    onSelect: React.PropTypes.func
  },

  getInitialState: function(){
    return {
      expanded: this.props.expanded != null ? this.props.expanded : false
    }
  },

  getCollapsableDOMNode: function(){
    return this.refs.panel.getDOMNode();
  },

  getCollapsableDimensionValue: function(){
    return this.refs.panel.getDOMNode().scrollHeight;
  },

  onHandleToggle: function(e){
    if(this.props.onSelect != null) {
      this.props.onSelect(e, this.props.eventKey)
    } else {
      this.handleClickEvent(e);
      this.handleToggle();
    }
  },

  handleClickEvent: function(e){
    e.preventDefault();
  },

  handleToggle: function(){
    this.setState({expanded:!this.state.expanded});
  },

  isExpanded: function(){
    return this.props.expanded != null ? this.props.expanded : this.state.expanded;
  },

  componentDidUpdate: function(prevProps, prevState){
    var wasExpanded = prevProps.expanded != null ? prevProps.expanded : prevState.expanded;
    var isExpanded = this.isExpanded();
    if(wasExpanded != isExpanded){
      this.internalToggle();
    }
  },

  render: function(){
    var styles = this.getCollapsableClassSet();
    var text = this.isExpanded() ? 'Hide' : 'Show';
    return (
      <div>
        <div><Button onClick={this.onHandleToggle}>{text} Content</Button></div>
        <div ref="panel" className={classSet(styles)}>
          {this.props.children}
        </div>
      </div>
    );
  }
});

var panelInstance = (
  <CollapsablePanel>
    Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid single-origin coffee nulla assumenda shoreditch et. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS.
  </CollapsablePanel>
);

React.render(panelInstance, mountNode);
