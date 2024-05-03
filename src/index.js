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

async function onSearch(evt) {
    evt.preventDefault();

    newApiService.query = evt.currentTarget.elements.searchQuery.value;
    newApiService.resetpage();
    await newApiService.fetchArticles()
        .then(({ data }) => {
            if (data.hits.length < newApiService.per_page && data.hits.length > 0) {
                Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`, { timeout: 3000, },);
                clearGallery()
                renderSearchQuery(data.hits);

            } else if (data.hits.length !== 0) {
                Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`, { timeout: 3000, },);
                clearGallery()
                renderSearchQuery(data.hits);
                refs.loadMore.classList.add('js-load-more');

            } else {
                Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
                clearGallery()
            }
            });
};

async function onLoadMore(evt) {
    newApiService.incrementPage()
    await newApiService.fetchArticles()
        .then(({ data }) => {
            if ((data.totalHits - (data.hits.length * newApiService.page)) < newApiService.per_page && (data.totalHits - (data.hits.length * newApiService.page)) > 0) {
                renderSearchQuery(data.hits);
                refs.loadMore.classList.remove('js-load-more');
                Notiflix.Notify.success(`Hooray! We found more ${data.hits.length} images.`, { timeout: 1000, },)
                setTimeout(() => {
                    Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
                }, 1500);
            } else if (data.hits.length !== 0) {
                Notiflix.Notify.success(`Hooray! We found ${data.totalHits - (data.hits.length * (newApiService.page - 1))} images.`, { timeout: 2000, },)
                renderSearchQuery(data.hits);

            } else {
                Notiflix.Notify.failure("We're sorry, but you've reached the end of search results.", { timeout: 3000, },)
                refs.loadMore.classList.remove('js-load-more');

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



