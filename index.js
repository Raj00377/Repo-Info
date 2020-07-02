var username;
var repos;

const input = document.getElementById('input');
const button = document.getElementById('button');
const displayRepoId = document.getElementById('displayRepo');
const errorTextId = document.getElementById('errorText');



var errorText = '<p>Repo not Found &#128064;</p>';
var valid = true;


input.addEventListener('keyup', (event) => {
    username = event.target.value;
    if (event.key === "Enter")
        searchRepo();
    console.log(username);
});


button.addEventListener('click', () => {
    searchRepo();
});


searchRepo = () => {
    fetch(`https://api.github.com/users/${username}/repos`)
        .then((response) => {
            if (response.ok)
                return response.json();
            else
                throw Error(`Status Code ${response.status}`);
        })
        .then((json) => {
            repos = json;
            console.log(repos);
            if (repos.length == 0) {
                valid = false
                errorTextId.innerHTML = errorText;
            }
        })
        .catch((err) => {
            valid = false;
            errorTextId.innerHTML = errorText;
            console.log(err.message);
        })

    if (valid) {
        repos.map((element) => {
            let type;
            if (element.private === true)
                type = 'private';
            else
                type = 'public';
            displayRepoId.innerHTML += `<div class = display-repo>
            <p>Name: ${element.name}<p>
            <p>Github Repo link: ${element.html_url}<p>
            <p>Programming Language: ${element.language}<p>
            <p>${type} Repo<p></div>`
        });
    }

}

