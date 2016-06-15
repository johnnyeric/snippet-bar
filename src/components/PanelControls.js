const React = require('react');
const Clipboard = require('clipboard');
const SweetAlert = require('sweetalert-react');

const SnippetActions = require('../actions/SnippetActions');
const SnippetStore   = require('../stores/SnippetStore')

const PanelButton = require('./PanelButton');

const PanelControls = React.createClass({
  propTypes: {
    mode:             React.PropTypes.string.isRequired,
    showNotification: React.PropTypes.func
  },

  getInitialState() {
    return {
      modes: SnippetStore.getModes()
    };
  },

  componentDidUpdate(){
    new Clipboard('.copy-btn');
  },

  copySnippet() {
    this.props.showNotification("Snippet Copied!");
  },

  confirmDelete() {
    this.setState({show: true});
  },

  showButtons() {
    let mode  = this.props.mode;
    let modes = this.state.modes;

    let copy   = <PanelButton kind="copy" key="copy" click={this.copySnippet} />;
    let del    = <PanelButton kind="del"  key="del"  click={this.confirmDelete} />;
    let edit   = <PanelButton kind="edit" key="edit" click={SnippetActions.setMode.bind(null, modes.edit)} />;
    let add    = <PanelButton kind="add"  key="add"  click={SnippetActions.setMode.bind(null, modes.add)} />;
    let save   = <PanelButton kind="save" type="submit" key="save" click={SnippetActions.create} />;
    let update = <PanelButton kind="update" type="submit" key="update" />;

    if      (mode === modes.empty)   return add;
    else if (mode === modes.add)     return save;
    else if (mode === modes.preview) return [copy, edit, del, add];
    else if (mode === modes.edit)    return [update, add];
  },

  render() {
    return(
      <div className="panel-controls">
        {this.showButtons()}
        <SweetAlert
            show={this.state.show}
            title="Delete"
            text="Confirm delete?"
            showCancelButton
            onConfirm={() => {
                this.setState({ show: false });
                SnippetActions.destroy(() => {
                    this.props.showNotification('Snippet Deleted!');
                });
            }}
            onCancel={() => {
                console.log('cancel'); // eslint-disable-line no-console
                this.setState({ show: false });
            }}
            onEscapeKey={() => this.setState({ show: false })}
            onOutsideClick={() => this.setState({ show: false })}
        />
      </div>
    );
  }
});

module.exports = PanelControls;
