"use strict";

const $showsList = $("#showsList");
const $episodesArea = $("#episodesArea");
const $searchForm = $("#searchForm");
const episodesList = $("#searchForm");

/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */
const defPic = "https://tinyurl.com/tv-missing";
const title = $("#searchForm-term");
const term = title.value;

async function getShowsByTerm(term) {
  const res = await axios.get("https://api.tvmaze.com/search/shows", {
    params: { q: term },
  });
  // ADD: Remove placeholder & make request to TVMaze search shows API.

  return res.data.map(function result(match) {
    console.log(res.data);
    let show = match.show;
    return {
      id: show.id,
      name: show.name,
      summary: show.summary ? show.summary : " ",
      //if show.image then show.image.medium, if not then defPic
      image: show.image ? show.image.medium : defPic,
    };
  });
}

/** Given list of shows, create markup for each and to DOM */

function populateShows(shows) {
  $showsList.empty();

  for (let show of shows) {
    const showHtml = $(
      `<div data-show-id="${show.id}" class="Show col-md-12 col-lg-6 mb-4">
         <div class="media">
           <img
              src="${show.image}"
              alt="${show.name}"
              class="w-25 me-3">
           <div class="media-body">
             <h5 class="text-primary">${show.name}</h5>
             <div><small>${show.summary}</small></div>
             <button class="btn btn-outline-light btn-sm Show-getEpisodes">
               Episodes
             </button>
           </div>
         </div>
       </div>
      `
    );

    $showsList.append(showHtml);
  }
}

/** Handle search form submission: get shows from API and display.
 *    Hide episodes area (that only gets shown if they ask for episodes)
 */

async function searchForShowAndDisplay() {
  const term = $("#searchForm-term").val();
  const shows = await getShowsByTerm(term);

  $episodesArea.hide();
  populateShows(shows);
}

$searchForm.on("submit", async function (evt) {
  evt.preventDefault();
  await searchForShowAndDisplay();
});

/** Given a show ID, get from API and return (promise) array of episodes:
 *      { id, name, season, number }
 */

async function getEpisodesOfShow(id) {
  const res = await axios.get(
    "https://api.tvmaze.com/search/shows/${id}/episodes"
  );
  return res.data.map((res) => ({
    id: res.id,
    name: res.name,
    season: res.season,
    number: res.number,
  }));
}

/** Write a clear docstring for this function... */

function populateEpisodes(episodes) {
  episodesList.empty();

  for (let episode of episodes) {
    const ep = $(`<li>
    ${episode.name}(season ${episode.season},
       episode ${episode.number})
       </li>`);
    episodesList.append(ep);
  }
  $episodesArea.show();
}

const showsList = document.querySelector("#showsList");
showsList.addEventListener("click", async function (e) {
  if (e.target.classList.contains("Show-getEpisodes")) {
    e.preventDefault();
    const closestShow = e.target.closets(".Show");
    const showId = closestShpw ? closestShow.dataset.showId : null;
    const episodes = await getEpisodesOfShow(showId);
    populateEpisodes(episodes);
  }
});
