const BASE_URL = "https://lighthouse-user-api.herokuapp.com"
const INDEX_URL = BASE_URL + "/api/v1/users/"
const user_per_page = 16
const users = JSON.parse(localStorage.getItem('favoriteUser'))
const dataPanel = document.querySelector('#data-panel')
let nowPage = 1
let filteredUser = []
const changeMode = document.querySelector('#changeMode')

let mode = 'card'

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

function getUserByPage(page) {
  const data = filteredUser.length ? filteredUser : users
  const startIndex = (page - 1) * user_per_page
  return data.slice(startIndex, startIndex + user_per_page)
}

dataPanel.addEventListener('click', (event) => {
  if (event.target.matches('.btn-show-user')) {
    showUserModal(Number(event.target.dataset.id))
  } else if (event.target.matches('.btn-remove-favorite')) {
    removeFavoriteUser(Number(event.target.dataset.id))
  }
})

function removeFavoriteUser(id) {
  if (!users) return
  const userIndex = users.findIndex((item) => item.id === id)
  if (userIndex === -1) return
  users.splice(userIndex, 1)
  localStorage.setItem('favoriteUser', JSON.stringify(users))
  displayData(users)
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
            <button type="button" class="btn btn-danger btn-remove-favorite" data-id="${item.id}">X</button>
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
                <td>
                   <button type="button" class="btn btn-danger btn-remove-favorite" data-id="${item.id}">X</button>
                </td>
                <td></td>    
                
              </tr>`
  })
  rawHTML += '</tbody></table>'
  dataPanel.innerHTML = rawHTML
}

renderUserListByCard(users)