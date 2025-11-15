import React from "react";
import "./Track.css";

class Track extends React.Component {
  constructor(props) {
    super(props);
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.playTrack = this.playTrack.bind(this);
    this.showModal = this.showModal.bind(this);
  }

  addTrack() {
    this.props.onAdd(this.props.track);
  }

  removeTrack() {
    this.props.onRemove(this.props.track);
  }

  playTrack() {
    if (this.props.onPlay) {
      this.props.onPlay(this.props.track);
    }
  }

  showModal() {
    if (this.props.onShowModal) {
      this.props.onShowModal(this.props.track);
    }
  }

  renderAction() {
    if (this.props.isRemoval) {
      return (
        <button
          className="Track-action"
          onClick={this.removeTrack}
          title="Remove from playlist"
        >
          ✕
        </button>
      );
    }
    return (
      <button
        className="Track-action"
        onClick={this.addTrack}
        title="Add to playlist"
      >
        +
      </button>
    );
  }

  render() {
    return (
      <div className="Track">
        <div
          className="Track-album-art"
          onClick={this.showModal}
          title="Click to view details"
        >
          <div className="album-note">♪</div>
        </div>
        <div
          className="Track-information"
          onClick={this.showModal}
          style={{ cursor: "pointer" }}
        >
          <h3>{this.props.track.name}</h3>
          <p>
            {this.props.track.artist} | {this.props.track.album}
          </p>
        </div>
        <button
          className="Track-play"
          onClick={this.playTrack}
          title="Play preview"
        >
          ▶
        </button>
        {this.renderAction()}
      </div>
    );
  }
}

export default Track;
