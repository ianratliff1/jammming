// import logo from './logo.svg';
import './App.css';
import React from 'react';
import SearchBar from '../SearchBar/SearchBar';
import Playlist from '../Playlist/Playlist';
import SearchResults from '../SearchResults/SearchResults';
// import TrackList from '../TrackList/TrackList';


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchResults: [{ name: 'name1', artist: 'artist1', album: 'album1', id: 1 }, { name: 'name2', artist: 'artist2', album: 'album2', id: 2 }, { name: 'name3', artist: 'artist3', album: 'album3', id: 3 }],
      playlistName: 'My Playlist',
      playlistTracks: [{ name: 'Diced Pineapples', artist: 'Rick Ross, Wale, Drake', album: 'God Forgives, I Don\'t (Deluxe Edition)', id: 4, uri: '27mF2eUbhExYWiOT0y9cuc' }, { name: 'Keep On', artist: 'Alfa Mist', album: 'Antiphon', id: 5, uri: '1GzBTeJLSh6frMPWxvNygc' }, { name: 'Suede', artist: 'NxWorries, Anderson .Paak, Knxwledge', album: 'Yes Lawd!', id: 6, uri: '0iizrCBnUUJuAwCPJaWWY0' }]
    }
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
  }

  addTrack(track) {
    let tracks = this.state.playlistTracks;
    if (tracks.find(savedTrack => savedTrack.id === track.id)) {
      return;
    }
    tracks.push(track);
    this.setState({ playlistTracks: tracks })
  }

  removeTrack(track) {
    let tracks = this.state.playlistTracks;
    tracks = tracks.filter(thisTrack => thisTrack.id !== track.id);
    this.setState({ playlistTracks: tracks });
    console.log(tracks);

  }

  updatePlaylistName(name) {
    this.setState( { playlistName: name} )
  }

  savePlaylist() {
    let trackURIs = [];
    let tracks = this.state.playlistTracks; 
    tracks.forEach(track => trackURIs.push(track.uri))
    // console.log(trackURIs)
  }

  search(searchTerm) {
    console.log(searchTerm);
  }

  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar onSearch={this.search} />
          <div className="App-playlist">
            <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack} />
            <Playlist playlistName={this.state.playlistName}
              playlistTracks={this.state.playlistTracks} 
              onRemove={this.removeTrack}
              onNameChange={this.updatePlaylistName}
              onSave={this.savePlaylist}
            />
          </div>
        </div>
      </div>
    )
  }
}



export default App;