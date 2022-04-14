import * as api from './api.js'
import { JSDOM } from 'jsdom';

const articleBaseUrl = process.env.FD_ARTICLES_BASE_URL


//AUXILIARY FUNCTIONS
async function AUX_printStructureFull(){
    const allCategories = await api.getCategories()
    for (let i = 0; i<allCategories.length; i++){
        console.log(`${allCategories[i].id}: ${allCategories[i].name}`)
        
        let allFoldersInCat = await api.getFolders(allCategories[i].id)
        for (let j = 0; j < allFoldersInCat.length; j++){
            console.log(`    ${allFoldersInCat[j].id}: ${allFoldersInCat[j].name}`)
            
            let allArticlesInFolder = await api.getArticles(allFoldersInCat[j].id)
            for (let y = 0; y < allArticlesInFolder.length; y++){
                console.log(`        ${allArticlesInFolder[y].id}: ${allArticlesInFolder[y].title}`)
            }
        }
    }
}
async function AUX_printStructureShort(){
    const allCategories = await api.getCategories()
    for (let i = 0; i<allCategories.length; i++){
        console.log(`${allCategories[i].id}: ${allCategories[i].name}`)
        
        let allFoldersInCat = await api.getFolders(allCategories[i].id)
        for (let j = 0; j < allFoldersInCat.length; j++){
            console.log(`    ${allFoldersInCat[j].id}: ${allFoldersInCat[j].name}`)
        }
    }
}
async function AUX_printFolder(folderId){
    const folder = await api.getSingleFolder(folderId)
    console.log(`${folder.id}: ${folder.name}`)

    let allArticlesInFolder = await api.getArticles(folderId)
    for (let y = 0; y < allArticlesInFolder.length; y++){
        console.log(`    ${allArticlesInFolder[y].id}: ${allArticlesInFolder[y].title}`)
    }
}
async function AUX_publishFolder (folderId){
    const articlesInFolder = await api.getArticles(folderId)
    
    for (let i = 0; i < articlesInFolder.length; i++){
        await api.publishArticle(articlesInFolder[i].id)
        console.log(`    Published article # ${articlesInFolder[i].id}`)
    }
    console.log(`Published entire folder ${folderId}`)
}
// AUX_printStructureShort()
// AUX_printStructureFull()
// AUX_printFolder(29000057657)
// AUX_publishFolder(29000057661)

async function putMicronav (prevArticle, currArticle, nextArticle){
    const dom = new JSDOM(currArticle.description)
    const document = dom.window.document
    
    // check if the micronav is already out there
    if (document.getElementById("micronav")){
        let oldNav = document.getElementById("micronav")
        oldNav.remove()
    }

    let micronav = ``
    let prevLink = ''
    let nextLink = ''
    let prevTitle = ''
    let nextTitle = ''
    
    if (prevArticle == undefined && nextArticle == undefined){
        micronav = ``
    }
    else if (prevArticle == undefined){
        nextLink = articleBaseUrl + nextArticle.id
        nextTitle = nextArticle.title
        micronav =
        `<p
            id="micronav"
            style="
            display: flex;
            justify-content: end;
            align-items: center;
            margin-top: 20px"
        >
            <span><a href="${nextLink}">${nextTitle} ᐳ</a></span>
        </p>`
    } else if (nextArticle == undefined){
        prevLink = articleBaseUrl + prevArticle.id
        prevTitle = prevArticle.title
        micronav =
        `<p
            id="micronav"
            style="
            display: flex;
            justify-content: start;
            align-items: center;
            margin-top: 20px"
        >
            <span><a href="${prevLink}">ᐸ ${prevTitle}</a></span>
        </p>`
    } else {
        prevLink = articleBaseUrl + prevArticle.id
        nextLink = articleBaseUrl + nextArticle.id
        prevTitle = prevArticle.title
        nextTitle = nextArticle.title
        micronav =
        `<p
            id="micronav"
            style="
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 20px"
        >
            <span><a href="${prevLink}">ᐸ ${prevTitle}</a></span>
            <span><a href="${nextLink}">${nextTitle} ᐳ</a></span>
        </p>`
    }
    
    const newBody = document.body.innerHTML + micronav

    await api.updateArticleDescription(currArticle.id, newBody)
    console.log(`    Processed article # ${currArticle.id}`)
}

async function putNavInFolder (folderId){
    const articlesInFolder = await api.getArticles(folderId)

    for (let i = 0; i < articlesInFolder.length; i++){
        await putMicronav(articlesInFolder[i-1],articlesInFolder[i],articlesInFolder[i+1])
    }
    console.log(`Processed folder ${folderId}`)
}

async function putNavInCategory (categoryId){
    const foldersInCategory = await api.getFolders(categoryId)
    console.log(`PROCESSING CATEGORY # ${categoryId}`)

    for (let i = 0; i < foldersInCategory.length; i++){
        await putNavInFolder(foldersInCategory[i].id)
    }
    console.log(`PROCESSED CATEGORY # ${categoryId}`)

}

// putNavInFolder(29000057661)
// putNavInCategory(29000035390)