class User {
  constructor(name, gender, birth, country, email, password, photo, admin) {
    this.id;
     this._name = name;
    this._gender = gender;
    this._birth = birth;
    this._country = country;
    this._email = email;
    this._password = password;
    this._photo = photo;
    this._admin = admin;
    
    this._register = new Date();
  }

  get id() {
    return this._id;
  }
  get register() {
    return this._register;
  }

  get name() {
    return this._name;
  }

  get gender() {
    return this._gender;
  }

  get birth() {
    return this._birth;
  }

  get country() {
    return this._country;
  }

  get email() {
    return this._email;
  }

  get password() {
    return this._password;
  }

  get photo() {
    return this._photo;
  }

  get admin() {
    return this._admin;
  }

  set photo(value) {
    this._photo = value;
  }

  /*
  set id(id) {
      this._id = id
  }
  */
  loadFromJSON(json) {
    for (let name in json) {
      switch (name) {
        case "_register":
          this[name] = new Date(json[name]);

          break;

        default:
          this[name] = json[name];
      }
    }
  }

 static getUserStorage() {
    let users = [];

    if (localStorage.getItem("users")) {
      users = JSON.parse(localStorage.getItem("users"));
    }
    return users;
  }

  getNewId() {
    let userID = parseInt(localStorage.getItem("userID"));
    if (!userID) userID = 0; // a partir do igual nós podemos chamar o id sem window, pois ele já está referenciado

    userID++;
    localStorage.setItem("userID", userID)
    return userID;
  }
  save() {
    let users = User.getUserStorage(); //retorna todos os usuários em um array e faz um parse

    if (this.id > 0) {
      //verifica se há um id
      users = users.map(u => {
        if (u._id == this.id) {
            u = this;
        }

        return u;
 });
    } else {
      this._id = this.getNewId();
      users.push(this);
    }

    // sessionStorage.setItem("users", JSON.stringify(users)); //aqui é onde gera a chave e o valor,
    localStorage.setItem("users", JSON.stringify(users)); //aqui é onde gera a chave e o valor,
    // sendo o primeiro a chave e o segundo o valor
  }
  deleteUser(){

   let  users = User.getUserStorage();
  users.forEach((UserData, index) => {
    if (this._id == UserData._id) {
      users.splice(index, 1);
      
    }
    
  });
  localStorage.setItem("users", JSON.stringify(users));
  }
}
