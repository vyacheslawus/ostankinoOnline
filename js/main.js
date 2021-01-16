const searchForm = document.getElementById('search-form');
const movies = document.getElementById('movies');
const urlPoster = 'https://image.tmdb.org/t/p/w500';

function apiSearch(event) {
  event.preventDefault();
  movies.innerHTML = `  <div class="spiner"></div>
      </div>`;
  const searchText = document.querySelector('.form-control').value,
  server = 'https://api.themoviedb.org/3/search/multi?api_key=d70f2f00227b885cccda865fe71ad931&language=ru&query=' + searchText;

  if (searchText.trim().length === 0) {
    movies.innerHTML = `<h2 class="col-12 text-center text-danger">Поле поиска не должно быть пустым!</h2>`;
    return;
  }


  fetch(server)
  .then((value) => {
   if (value.status !== 200){
     return Promise.reject(new Error('Oshibka'));
   }

    return value.json();
  })
  .then((output) => {
    let inner = '';
    if (output.results.length === 0){
      inner = '<h2 class="col-12 text-center text-info">По вашему запросу результатов не найдено</h2>'
    }
    output.results.forEach(item => {
     let nameItem = item.name || item.title;
     const poster = item.poster_path ? urlPoster + item.poster_path : './img/noposter.png';

     let dataInfo = '';
     if (item.media_type !== 'person') dataInfo = `data-id="${item.id}" data-type="${item.media_type}"
     `;

      inner += `
      <div class="col-12 col-md-6 col-xl-3 item">
      <img src="${poster}" alt="${nameItem}" ${dataInfo} class="img_poster">
     <h5>${nameItem}</h5>
      </div>
      `;
     });
     movies.innerHTML = inner;

    addEventMedia();
 

  })
  .catch((reason) => {
    movies.innerHTML = 'ooops... this is error :(';
    console.log('error: ' + reason);
  });
};


searchForm.addEventListener('submit', apiSearch);

function addEventMedia(){
      const media = movies.querySelectorAll('img[data-id]');
      media.forEach((elem) => {
       elem.style.cursor = 'pointer';
       elem.addEventListener('click', showFullInfo)
     });
}

function showFullInfo(){
  let url = '';
  if (this.dataset.type === 'movie') {
    url = 'https://api.themoviedb.org/3/movie/' + this.dataset.id + '?api_key=d70f2f00227b885cccda865fe71ad931&language=ru'
  } else if (this.dataset.type === 'tv') {
    url = 'https://api.themoviedb.org/3/tv/' + this.dataset.id + '?api_key=d70f2f00227b885cccda865fe71ad931&language=ru'
  } else {
    movies.innerHTML = `<h2 class="col-12 text-center text-danger">Ошибка сервера. Повторите запрос.</h2>`;
  }


fetch(url)
  .then((value) => {
   if (value.status !== 200){
     return Promise.reject(new Error('Oshibka'));
   }

    return value.json();
  })
  .then((output) => {
 
    movies.innerHTML = `
    <h4 class="col-12 text-center popular">${output.name || output.title}</h4>
    <div class="col-4 wrap">
    <img src="${urlPoster + output.poster_path}" alt="${output.name || output.title}">
    ${(output.homepage) ? `<p class="text-center links"><a href="${output.homepage}" target="blank">Официальная страница</a></p>` : ''}
    ${(output.imdb_id) ? `<p class="text-center links"><a href="https://imdb.com/title/${output.imdb_id}" target="blank">Страница на IMDB.com</a></p>` : ''}

    </div>
    <div class="col-8 jumbotron wrap">
    <p class="open_movie">Рейтинг: ${output.vote_average} </p>
    <p class="open_movie">Статус: ${output.status} </p>
    <p class="open_movie">Дата релиза: ${output.first_air_date || output.release_date} </p>

    ${(output.last_episode_to_air) ? `<p class="open_movie">${output.number_of_seasons} сезон ${output.last_episode_to_air.episode_number} серий вышло</p>` : ''}

    <p class="open_movie">Описание: ${output.overview}</p>

    
    
    <p class="open_movie">Жанр: ${output.genres.map(item => {return item.name})}</p>
    <p class="open_movie">Страна: ${output.production_countries.map((item) => item.name)}</p>

    <br>
    <div class="youtube">
    
    </div>


    </div>
    `;
getVideo(this.dataset.type, this.dataset.id);

    

  })
  .catch((reason) => {
    movies.innerHTML = 'ooops... this is error :(';
    console.log('error: ' + reason);
  });

};

document.addEventListener('DOMContentLoaded', function(){
  fetch('https://api.themoviedb.org/3/trending/all/day?api_key=d70f2f00227b885cccda865fe71ad931&language=ru')
  .then((value) => {
   if (value.status !== 200){
     return Promise.reject(new Error('Oshibka'));
   }

    return value.json();
  })
  .then((output) => {
    let inner = '<h4 class="col-12 text-center popular">Популярные за неделю</h4>';
    if (output.results.length === 0){
      inner = '<h2 class="col-12 text-center text-info">По вашему запросу результатов не найдено</h2>'
    }
    output.results.forEach(item => {
     let nameItem = item.name || item.title;
     let mediaType = item.title ? 'movie' : 'tv';
     const poster = item.poster_path ? urlPoster + item.poster_path : './img/noposter.png';

     let dataInfo = `data-id="${item.id}" data-type="${mediaType}"
     `;
      inner += `
      <div class="col-12 col-md-6 col-xl-3 item">
      <img src="${poster}" alt="${nameItem}" ${dataInfo} class="img_poster">
     <h5>${nameItem}</h5>
      </div>
      `;
     });
     movies.innerHTML = inner;

    addEventMedia();
 

  })
  .catch((reason) => {
    movies.innerHTML = 'ooops... this is error :(';
    console.log('error: ' + reason);
  });

});

function getVideo(type, id){
    let youtube = movies.querySelector('.youtube');

    fetch(`https://api.themoviedb.org/3/${type}/${id}/videos?api_key=d70f2f00227b885cccda865fe71ad931&language=ru`)
    .then((value) => {
   if (value.status !== 200){
     return Promise.reject(new Error('Oshibka'));
   }

    return value.json();
  })
  .then((output) => {
    console.log(output);
    let videoFrame = '<h5 class="text-danger">Трейлеры</h5>'

    if (output.results.length === 0) {
      videoFrame = '<p class="text-danger">Видео не найдено</p>'
    }

    output.results.forEach((item) => {
      videoFrame += '<iframe width="560" class="iframe" height="315" src="https://www.youtube.com/embed/' + item.key + '" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';

    });


    youtube.innerHTML = videoFrame;
  })
  .catch((reason) => {
    youtube.innerHTML = 'Видео недоступно';
    console.log('error: ' + reason);
  });

    youtube.innerHTML = type;
}