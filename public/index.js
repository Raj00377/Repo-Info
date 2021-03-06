const input = document.getElementById('input');
const tokenInput = document.getElementById('token-input');
const button = document.getElementById('button');
const displayRepoId = document.getElementById('display-repo');
const errorTextId = document.getElementById('error-text');
const profileImgId = document.getElementById('profile-img-ID');
const orgNameId = document.getElementById('org-ID');
const repoDropDown = document.getElementById('repo-dropdown');
const repoDropDownId = document.getElementById('repo-dropdown-ID');
const langDropdownId = document.getElementById('lang-dropdown-ID');
const langDropdown = document.getElementById('lang-dropdown');


var token = undefined;
var header;
var orgName;
var repos;
var branches;
var previousBranchName;
var errorText = '<p>Repo not Found &#128064;</p>';
var repoType;
var lang;
var repoFlag;
var flag;


input.addEventListener('keyup', (event) => {
    orgName = event.target.value;
    if (event.key === "Enter")
        searchRepo();
});

tokenInput.addEventListener('keyup', (event) => {
    token = event.target.value;
    if (event.key === "Enter")
        setHeaders();
})


button.addEventListener('click', () => {
    if (token != null)
        setHeaders();
    else
        searchRepo();
});


setHeaders = () => {
    header = {
        "Authorization": `Token ${token}`,
        "Accept": "application/vnd.github.nebula-preview+json"
    };
    searchRepo();
}

showBranches = (name) => {
    if (name.style.display == 'block')
        name.style.display = 'none';
    else
        name.style.display = 'block';
}

getRepoType = () => {
    repoType = repoDropDownId.value;
    if (repoType == 'private')
        repoFlag = true;
    else
        repoFlag = false;
    flag = false;
    count++;
    displayRepo();
}
getLanguage = () => {
    lang = langDropdownId.value;
    flag = false;
    count++;
    displayRepo();
}


toInnerHTML = (element) => {
    fetch(`https://api.github.com/repos/${orgName}/${element.name}/branches`, {
        headers: header
    })
        .then(response => response.json())
        .then((json) => {
            branches = json;
            let type;
            if (element.private === true)
                type = 'private';
            else
                type = 'public';

            displayRepoId.innerHTML +=
                `
                <div class = display-repo>
                    <p>Name: ${element.name}</p>
                    <p>Description: <br/> ${element.description}</p>
                    <p>Github Repo link: <br/><a href=${element.html_url} target='_blank'>/${element.name}</a></p>
                    <p class='no-of-branches' onclick= showBranches(${element.name.split(/[.-]+/).join('')})>No of Branches: ${branches.length}</p> 
                    <span style='font-size:22px'>&#10095;</span>
                    <div id=${element.name.split(/[.-]+/).join('')} class='branches-list'>
                    ${branches.map(element => `<p>* ${element.name}</p>`).join('')}
                    </div>
                    <p>Programming Language: ${element.language}</p>
                    <p>Repo Type: ${type}</p>
                </div>
                `

        })
        .catch((err) => {
            errorTextId.innerHTML = errorText;
            displayRepoId.innerHTML = null;
            profileImgId.innerHTML = null;
            orgNameId.innerHTML = null;
            repoDropDown.style.display = 'none';
            langDropdown.style.display = 'none';
            console.log(err.message);
        })
}



displayRepo = () => {
    displayRepoId.innerHTML = null;
    repos.map((element) => {
        if (element != undefined && element != null) {
            if (flag) {
                toInnerHTML(element);
            }
            else if (element.private === repoFlag && element.language === lang) {
                toInnerHTML(element);
            }
            else if (element.language === lang && repoFlag === undefined) {
                toInnerHTML(element);
            }
            else if (lang === undefined && element.private === repoFlag) {
                toInnerHTML(element);
            }
        }
    });
}



searchRepo = () => {
    flag = true;
    if (token == '')
        header = undefined;
    errorTextId.innerHTML = null;
    displayRepoId.innerHTML = null;
    count = 0;
    fetch(`https://api.github.com/orgs/${orgName}/repos`,
        {
            headers: header
        })

        .then((response) => {
            if (response.ok)
                return response.json();
            else if (response.status == '403') {
                return;
            }
            else
                throw Error(`Status Code ${response.status}`);
        })
        .then((data) => {
            if (data.length == 0) {
                throw Error(`Empty Repo`);
            }
            else {
                let langArray = [];
                langDropdownId.innerHTML = '<option selected disabled value="">Select</option>';
                langDropdownId.innerHTML +=
                    data.map((element) => {
                        if (element.language != null) {
                            if (langArray.indexOf(element.language) == -1) {
                                langArray.push(element.language);
                                return `<option value="${element.language}">${element.language}</option>`
                            }
                        }
                })
                profileImgId.style.display = 'block';
                repoDropDown.style.display = 'block';
                langDropdown.style.display = 'block';
                profileImgId.innerHTML = `<img src=${data[0].owner.avatar_url} class = 'profile-img'>`;
                orgNameId.innerHTML = `<p>Organisation Name: ${data[0].owner.login}</p>`;
                repos = data;
                displayRepo();
            }
        })
        .catch((err) => {
            errorTextId.innerHTML = errorText;
            displayRepoId.innerHTML = null;
            profileImgId.innerHTML = null;
            orgNameId.innerHTML = null;
            repoDropDown.style.display = 'none';
            langDropdown.style.display = 'none';
            console.log(err.message);
        })

}

