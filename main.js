const BASE_URL = "https://lighthouse-user-api.herokuapp.com"
const INDEX_URL = BASE_URL + "/api/v1/users/"
const user_per_page = 16
const users = []
const dataPanel = document.querySelector('#data-panel')
const paginator = document.querySelector('#paginator')
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')
let filteredUser = []
const changeMode = document.querySelector('#changeMode')
const filterGender = document.querySelector('#filterGender')
const regionList = document.querySelector('#regionList')
const optionSelectSearch = document.querySelector('#option-select-search')
let mode = 'card'
let nowPage = 1


//filter region list
regionList.addEventListener('click', (event) => {
  const region = event.target.id
  filteredUser = users.filter((user) => user.region === region)
  renderUserPage(filteredUser.length)
  displayData()
})

//filter gender
filterGender.addEventListener('click', (event) => {
  if (event.target.matches('.btn-male')) {
    filteredUser = users.filter(user => user.gender === 'male')
  } else if (event.target.matches('.btn-female')) {
    filteredUser = users.filter(user => user.gender === 'female')
  } else {
    filteredUser = users
  }
  renderUserPage(filteredUser.length)
  nowPage = 1
  displayData()
})

//changeMode
changeMode.addEventListener('click', (event) => {
  if (event.target.matches('#cardMode')) {
    mode = 'card'
  } else if (event.target.matches('#listMode')) {
    mode = 'list'
  }
  displayData()
})
function displayData() {
  const userList = getUserByPage(nowPage)
  mode === 'card' ? renderUserListByCard(userList) : renderUserListByList(userList)
}

//Search bar              
searchForm.addEventListener('submit', (event) => {
  event.preventDefault()
  searchResult()
})
function searchResult() {
  const keyword = searchInput.value.trim().toLowerCase()
  if (optionSelectSearch.value === 'name') {
    filteredUser = users.filter((user) => user.name.toLowerCase().includes(keyword))
    searchResultRender(filteredUser)
  } else {
    filteredUser = users.filter((user) => user.surname.toLowerCase().includes(keyword))
    searchResultRender(filteredUser)
  }
}
function searchResultRender(data) {
  if (filteredUser.length === 0) {
    alert('Not found')
  }
  renderUserPage(filteredUser.length)
  nowPage = 1
  displayData()
}

//page
function getUserByPage(page) {
  const data = filteredUser.length ? filteredUser : users
  const startIndex = (page - 1) * user_per_page
  let pageData = data.slice(startIndex, startIndex + user_per_page)
  return (pageData)
}
function renderUserPage(amount) {
  let rawHTML = ''
  const numberOfPage = Math.ceil(amount / user_per_page)
  for (let page = 1; page <= numberOfPage; page++) {
    rawHTML += `<li class="page-item"><a class="page-link" href="#" data-page = "${page}">${page}</a></li>`
  }
  paginator.innerHTML = rawHTML
}
paginator.addEventListener('click', function onPageClicked(event) {
  if (event.target.tagName !== 'A') return
  nowPage = Number(event.target.dataset.page)
  displayData()
})

//add favorite or show modal
dataPanel.addEventListener('click', (event) => {
  if (event.target.matches('.btn-show-user')) {
    showUserModal(Number(event.target.dataset.id))
  } else if (event.target.matches('.fa-user-plus')) {
    addToFavorite(Number(event.target.dataset.id))
  }
})
function addToFavorite(id) {
  const list = JSON.parse(localStorage.getItem('favoriteUser')) || []
  const user = users.find((user) => user.id === id)
  if (list.some((user) => user.id === id)) {
    alert('This person is already chosen in the list')
  } else {
    alert('add')
    list.push(user)
  }
  localStorage.setItem('favoriteUser', JSON.stringify(list))
}
function showUserModal(id) {
  const userName = document.querySelector('#user-name')
  const userAvator = document.querySelector('#user-avator')
  const userGender = document.querySelector('#user-gender')
  const userBirthday = document.querySelector('#user-birthday')
  const userAge = document.querySelector('#user-age')
  const userRegion = document.querySelector('#user-region')
  const userEmail = document.querySelector('#user-email')
  const url = INDEX_URL + id
  axios.get(url)
    .then((response) => {
      const data = response.data
      userName.innerText = data.name + ' ' + data.surname
      userGender.innerText = 'Gender : ' + data.gender
      userBirthday.innerText = 'Birthday : ' + data.birthday
      userAge.innerText = 'Age : ' + data.age
      userRegion.innerText = 'Region : ' + data.region
      userEmail.innerText = 'Email : ' + data.email
      userAvator.innerHTML = `<img src="${data.avatar}" alt="..." class="img-fluid">`
    })
    .catch((err) => console.log(err))
}

function renderUserListByCard(data) {
  let rawHTML = ""
  data.forEach((item) => {
    rawHTML += `
    
      <div class="col-sm-3 mb-2">         
        <div class="card text-center">
          <img src=${item.avatar} class="card-img-top" alt="...">
          <div class="card-body">
            <h5 class="card-title">${item.name}</h5>    
          </div>
          <div class="card-footer d-flex justify-content-around">
            <button type="button" class="btn btn-info btn-show-user" data-toggle="modal" data-target="#user-modal" data-id=${item.id}>View</button> 
            <h5 class="ml-2"><i class="fas fa-user-plus fa-lg icon-favorite" data-id=${item.id}></i></h5>
          </div>
        </div>  
      </div>
      </div>`
  })


  dataPanel.innerHTML = rawHTML
}

function renderUserListByList(data) {
  let rawHTML = ""
  rawHTML += `<table class="table"><tbody>`
  data.forEach((item) => {
    rawHTML += `<tr>
                <td class="d-flex justify-content-between">
<span><img src="${item.avatar}" style="width:80px;">
                  ${item.name} ${item.surname}</span>
                </td>
                <td class='list-btn'>
 	                <button type="button" class="btn btn-info btn-show-user" data-toggle="modal" data-target="#user-modal" data-id=${item.id}>View</button>
                </td>
                <td class='list-icon'>
                   <h5><i class="fas fa-user-plus fa-lg icon-favorite" data-id=${item.id}></i></h5>
                </td>
                <td></td>    
                
              </tr>`
  })
  rawHTML += '</tbody></table>'
  dataPanel.innerHTML = rawHTML
}

axios
  .get(INDEX_URL)
  .then((response) => {
    users.push(...response.data.results)
    renderUserPage(users.length)
    displayData()
  })
  .catch((err) => { console.log(err) })