const chooseSection = document.querySelector('#choose-icons')
const icons = document.querySelectorAll('.choice-icon');
const formSections = document.querySelectorAll('.website-form-section');
const facebookForm = document.querySelector('form[name=fb-form]');
const instagramForm = document.querySelector('form[name=insta-form]');
const resultSection = document.querySelector('#results')

const toggleLoading = condition => {
    document.querySelector('.overlay').style.display = condition ? 'block' : 'none';
    document.querySelector('.loading').style.display = condition ? 'block' : 'none';
}

const errorHandler = err => {
    toggleLoading(false);
    chooseSection.style.display = 'none';
    formSections.forEach(section => { section.style.display = 'none' });
    resultSection.innerHTML = `
    <h3>Sorry, we couldn't find this photo :(</h3>
    <p>May be there's a problem with your URL or we don't have access to it. Sometimes this is because our server is busy.</p>
    <a href="/" class="btn btn-primary w-50 d-block ml-auto mr-auto mt-3 mb-3">Try Again</a>
    <p class="h6">${JSON.stringify(err)}</p>
    `
}

const parseResult = result => {
    toggleLoading(false);
    chooseSection.style.display = 'none';
    formSections.forEach(section => { section.style.display = 'none' });
    resultSection.innerHTML = `
    <h3>Got image successfully</h3>
    <img src="${result}" class="mw-100" alt="Wanted Image">
    <a download href="${result}" class="btn btn-primary w-50 d-block ml-auto mr-auto mt-3 mb-3">Download</a>
    <a href="/" class="btn btn-primary w-50 d-block ml-auto mr-auto mt-3 mb-3">Try Again</a>
    `;
}


icons.forEach(node => {
    node.addEventListener('click', e => {
        icons.forEach(icon => { icon.style.opacity = 0.3; })
        node.style.opacity = 1;
        chooseSection.querySelector('h2').style.display = 'none';
        chooseSection.style.transform = 'translateY(-27vh)';
        formSections.forEach(section => { section.style.display = 'none'; })
        document.querySelector(`#${node.dataset.website}`).style.display = 'block';
    })
})


facebookForm.addEventListener('submit', e => {
    e.preventDefault();
    toggleLoading(true);
    const urlType = document.querySelector('#url-type-select').value;
    let url = document.querySelector('#fb-url').value.toLowerCase();
    url.startsWith('https://') || url.startsWith('http://') || (url = `https://${url}`);
    url.includes('m.facebook') && (url = url.replace('m.facebook', 'www.facebook'))

    if (urlType == 'picture') {
        let xpath = '//*[@id="u_0_e"]/div[1]/img';
        $.ajax({
            url: `/img-page?path=${xpath}&url=${url}`,
            success: parseResult,
            error: errorHandler
        })
    } else if (urlType == 'profile') {
        $.ajax({
            url: `/id?url=${url}`,
            success: r => {
                parseResult(`https://graph.facebook.com/${r}/picture?type=large&width=720&height=720`);
            },
            error: errorHandler
        })
    }
})

instagramForm.addEventListener('submit', e => {
    e.preventDefault();
    toggleLoading(true);
    let url = document.querySelector('#insta-url').value;
    url.startsWith('https://') || url.startsWith('http://') || (url = `https://${url}`);

    let xpath = '//*[@id="react-root"]/section/main/div/div/article/div[1]/div/div/div[1]/img';
    
    $.ajax({
        url: `/img-page?path=${xpath}&url=${url}`,
        success: parseResult,
        error: () => {
            xpath = '//*[@id="react-root"]/section/main/div/div/article/div[1]/div/div/div[1]/div[1]/img';
            $.ajax({
                url: `/img-page?path=${xpath}&url=${url}`,
                success: parseResult,
                error: errorHandler
            })
        }
    })
})