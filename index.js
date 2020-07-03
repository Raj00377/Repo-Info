const input = document.getElementById('input');
const button = document.getElementById('button');
const displayRepoId = document.getElementById('display-repo');
const errorTextId = document.getElementById('error-text');
const profileImgId = document.getElementById('profile-img-ID');
const usernameId = document.getElementById('username-ID');

var username;
var repos;
var branches;
var toggleBranches = true;
var previousBranchName;
var errorText = '<p>Repo not Found &#128064;</p>';

input.addEventListener('keyup', (event) => {
    username = event.target.value;
    if (event.key === "Enter")
        searchRepo();
});


button.addEventListener('click', () => {
    searchRepo();
});


searchRepo = () => {
    errorTextId.innerHTML = null;
    displayRepoId.innerHTML = null;

    fetch(`https://api.github.com/users/${username}/repos`)
        .then((response) => {
            if (response.ok)
                return response.json();
            else if (response.status === '403') {
                console.log("403");
            }
            else
                throw Error(`Status Code ${response.status}`);
        })
        .then((json) => {
            repos = json;
            if (repos.length == 0) {
                throw Error(`Empty Repo`);
            }
            else {
                profileImgId.innerHTML = `<img src=${repos[0].owner.avatar_url} class = 'profile-img'>`;
                usernameId.innerHTML = `<p>User Name: ${repos[0].owner.login}</p>`;
                repos.map((element) => {
                    fetch(`https://api.github.com/repos/${username}/${element.name}/branches`)
                        .then(response => response.json())
                        .then((json) => {
                            branches = json;
                            showBranches = (name) => {
                                if (name.style.display == 'none')
                                    name.style.display = 'block';
                                else
                                    name.style.display = 'none';
                            }
                            let type;
                            if (element.private === true)
                                type = 'private';
                            else
                                type = 'public';
                            displayRepoId.innerHTML +=
                                `
                            <div class = display-repo>
                                <p>Name: ${element.name}</p>
                                <p>Github Repo link: <br/><a href=${element.html_url} target='_blank'>${element.html_url}</a></p>
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
                            console.log(err.message);
                        })
                });

            }
        })
        .catch((err) => {
            errorTextId.innerHTML = errorText;
            displayRepoId.innerHTML = null;
            console.log(err.message);
        })

}

