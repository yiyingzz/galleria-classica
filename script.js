// I have a couple of questions at the very bottom 

const gallery = {};

gallery.baseUrl = `https://www.rijksmuseum.nl/api/en/collection`;
gallery.key = `eS6kCzBM`;

gallery.$modal = $('.modal-bg'); // entire modal
gallery.$imageInfo = $('.image-info'); // modal box content
gallery.$gallery = $('.gallery');
gallery.$galleryCard = $('.gallery-card-text');
gallery.$form = $('form');
gallery.$searchInput = $('input[id="search"]');


gallery.displayImages = (array) => {
    array.forEach((image) => {
        gallery.$gallery.append(`
        <div class="gallery-box">
            <div class="image-box">
                <img src="${image.webImage.url}" alt="${image.title}">
                <span class="image-id">${image.objectNumber}</span>
            </div>
        </div>  
        `);
    })
}; 

// grab data for each image
gallery.getImageDetails = (objectNumber) => {
    gallery.$imageInfo.empty();
    $.ajax({
        url: `${gallery.baseUrl}/${objectNumber}`,
        method: 'GET',
        dataType: 'json',
        data: {
            key: gallery.key,
        }
    }).then((data) => {
        gallery.displayImageInfo(data);
    })
};

gallery.displayImageInfo = (image) => {
    const htmlToAppend = `
        <div class="modal-image">
            <img src="${image.artObject.webImage.url}" alt="${image.artObject.title}">
        </div>
        <div class="modal-text">
            <h3>${image.artObject.title}</h3>
            <p class="italics">${image.artObject.scLabelLine}</p>
    `;
    if (image.artObject.plaqueDescriptionEnglish !== null) {
        gallery.$imageInfo.html(`
            ${htmlToAppend}
                <p>${image.artObject.plaqueDescriptionEnglish}</p>
            </div>
        `);   
    } else {
        gallery.$imageInfo.html(`
            ${htmlToAppend}
            </div>
        `);   
    }
}

// need to grab search query
gallery.$form.on('submit', (event) => {
    event.preventDefault();
    gallery.$gallery.empty();
    const userQuery = gallery.$searchInput.val();
    gallery.getPaintings(userQuery);
    gallery.$searchInput.val('');
});


// get paintings from API
gallery.getPaintings = (query) => {
    $.ajax({
        url: `${gallery.baseUrl}`,
        method: 'GET',
        dataType: 'json',
        data: {
            key: gallery.key,
            imgonly: true, 
            type: 'painting',
            ps: 9,
            q: query
        }
    }).then(function(data) {
        gallery.displayImages(data.artObjects);
        gallery.updateGalleryCard(query);
    }).fail(function(error) {
        console.log(error);
    })
};

// event for clicking on a single painting
gallery.$gallery.on('click', '.image-box', function() {
    gallery.$modal.css('display', 'flex');
    const imgId = $(this).children().contents()[0].textContent;
    gallery.getImageDetails(imgId); 
});

// update Current Exhibition info
gallery.updateGalleryCard = (query) => {
    gallery.$galleryCard.html(`
        <h2>Current Exhibition</h2>
        <p>You are currently viewing a selection of paintings from <a href="https://www.rijksmuseum.nl/">The Rijksmuseum</a> related to the theme of <span class="italics">${query}</span>. </p>
        <p class="italics">Would you like to see more paintings?</p>
    `);
}

// event to close modal box using 'X'
$('.close').on('click', () => {
    gallery.$modal.css('display', 'none');
});

// event to close modal by clicking outside of it
$(window).on('click', (event) => {
    if (event.target == gallery.$modal[0]) {
        gallery.$modal.css('display', 'none');
    }
});


// initialization
gallery.init = () => {
    gallery.getPaintings('still life');
};

// document ready
$(function() {
    gallery.init();
});


// Qs:
// 1. I used an init() to put some images on the page, but if I just wanted to leave it without images and just have the search box, is it necessary to have an init() or document ready? If I didn't have the init(), I'm not sure what I would put into the document ready. Or would I just put all my code in there?

// 2. I didn't use an async function at all, but I'm just wondering if it could have been used somewhere? Or not necessary for this project?