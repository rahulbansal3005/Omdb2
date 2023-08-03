async function fetchPlaylistDataFromAPI(searchQuery) {
  const apiUrl = `https://www.omdbapi.com/?s=${searchQuery}&apikey=2e5a9437`;
  const response = await fetch(apiUrl);
  const data = await response.json();
  return data;
}

async function searchMovies() {
  const searchQuery = document.getElementById("searchInput").value;
  // const response = await fetch(
  // `https://www.omdbapi.com/?s=${searchQuery}&apikey=2e5a9437`
  // );
  const data = await fetchPlaylistDataFromAPI(searchQuery);
  console.log(data, "data");
  const movieResults = document.getElementById("movieResults");
  movieResults.innerHTML = "";
  if (data.Search) {
    data.Search.forEach((movie) => {
      const movieItem = document.createElement("div");
      movieItem.innerHTML = `
                    <h2>${movie.Title}</h2>
                    <p>${movie.Year}</p>
                `;
      movieResults.appendChild(movieItem);
    });
  } else {
    movieResults.innerHTML = "<p>No movies found.</p>";
  }
}

async function createPlaylist() {
  const searchQuery = document.getElementById("searchInput").value;
  const playlistName = document.getElementById("playlistName").value;
  const isPublic = document.getElementById("isPublic").checked;
  const userName = document.getElementById("userName").value;
  const data = await fetchPlaylistDataFromAPI(searchQuery);
  console.log(userName);
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userName: userName,
      name: playlistName,
      isPublic: isPublic,
      playlistData: data.Search,
    }),
  };

  fetch("http://127.0.0.1:3000/api/createPlaylist", requestOptions)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
  const playlistList = document.getElementById("playlistList");
  const playlistItem = document.createElement("li");
  playlistItem.textContent = data.name;
  playlistList.appendChild(playlistItem);
}

async function getPlayListOnUserName() {
  const userName = document.getElementById("userName").value;
  const requestOptions = {
    method: "GET", // Change the method to "GET"
    headers: {
      "Content-Type": "application/json",
    },
  };

  fetch(
    `http://127.0.0.1:3000/api/playlists?userName=${userName}`,
    requestOptions
  )
    .then((response) => response.json())
    .then((data) => {
      showPlaylists(data);
      console.log(data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}
function showPlaylists(data) {
  const playlist = document.getElementById("movieResults");
  playlist.innerHTML = "";
  if (data.message == null) {
    for (i = 0; i < data.length; i++) {
      let playlistData = data[i].playlistData;
      playlistData.forEach((movie) => {
        const movieItem = document.createElement("div");
        movieItem.innerHTML = `
                          <h2>${movie.Title}</h2>
                          <p>${movie.Year}</p>
                      `;
        playlist.appendChild(movieItem);
      });
    }
  } else {
    playlist.innerHTML = "<p>No Playlists found.</p>";
  }
}
