// import SimpleLightbox from "simplelightbox";
// import "simplelightbox/dist/simple-lightbox.min.css";
import Notiflix from 'notiflix';
import NewApiService from "./news-service";

const  refs = {
     searchForm: document.querySelector('.search-form'),
     searchInput: document.querySelector('input[name="searchQuery"]'),
     gallery: document.querySelector('.gallery'),
     loadMore: document.querySelector('.load-more'),
}

const newApiService = new NewApiService()

refs.searchInput.addEventListener('focus', () => {
    refs.searchInput.value = '',
    refs.loadMore.classList.remove('js-load-more')
})

refs.searchForm.addEventListener('submit', onSearch);
refs.loadMore.addEventListener('click', onLoadMore);

function onSearch(evt) {
    evt.preventDefault();

    newApiService.query = evt.currentTarget.elements.searchQuery.value;
    newApiService.resetpage();
    newApiService.fetchArticles()
        .then(({ data }) => {
            if (data.hits.length !== 0) {
                Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`, { timeout: 3000, },);
                clearGallery()
                renderSearchQuery(data.hits);
                refs.loadMore.classList.add('js-load-more');
                console.log('Page:', newApiService.page)
            } else {
                Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
                clearGallery()
            }
            });
};

function onLoadMore(evt) {
    newApiService.incrementPage()
    newApiService.fetchArticles()
        .then(({ data }) => {
            if ((data.hits.length * newApiService.page) > data.totalHits) {
                refs.loadMore.classList.remove('js-load-more')
                Notiflix.Notify.info("We're sorry, but you've reached the end of search results.", { timeout: 3000, },)
            }
          else {
                Notiflix.Notify.success(`Hooray! We found ${data.totalHits - (data.hits.length * (newApiService.page - 1))} images.`, { timeout: 2000, },) 
                renderSearchQuery(data.hits)
                console.log('Page:', newApiService.page)

            }
  })
}

function renderSearchQuery(items) {
    const markup = items
        .map(({ webformatURL, tags, likes, views, comments, downloads }) => {
            return `<div class="photo-card">
            <img src="${webformatURL}" alt="${tags}" width="320px" loading="lazy" />
            <div class="info">
            <p class="info-item">
            <b>Likes</b><br>${likes}
            </p>
            <p class="info-item">
            <b>Views</b><br>${views}
             </p>
            <p class="info-item">
            <b>Comments</b><br>${comments}
            </p>
            <p class="info-item">
            <b>Downloads</b><br>${downloads}
            </p>
            </div>
            </div>`
        })
        .join('')
    refs.gallery.insertAdjacentHTML("beforeend", markup)
}
    
function clearGallery() {
    refs.gallery.innerHTML = '';
}



