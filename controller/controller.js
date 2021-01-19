class UserController {
  constructor(formId, TableId) {
    //recebe os ids
    this.formEl = document.getElementById(formId);
    this.TableEl = document.getElementById(TableId);
    console.log(this.formEl);
    this.OnSubmit(); //colocamos o OnSubmit aqui para ele já ser iniciado
    this.EditonCancel();
  }

  EditonCancel() {
    document
      .querySelector("#box-user-update .btn-cancel")
      .addEventListener("click", (e) => {
        this.showPanelCreate();
      });
  }

  // -- >> OnSubmit executa o código quando algum botão for pressionado(EVent Listener de click*//
  OnSubmit() {
    this.formEl.addEventListener(
      "submit",
      /* function  removemos a function pois ela limita o escopo
         entao ela só recebe o evento(que no caso é o submit, e deixa ele pegar o método Get Values
            //Nao precisamos chamar o evento no Html Pois há um Event listener Submit, ou seja, quando o JS
            //"ouvir" o submit ele automitcamente chama este método, não é possível chamar direto pois ele está
            //fora do escopo global, se limitando apenas no escopo do contructor User Controller.
            fora do escopo*/ (
        event
      ) => {
        event.preventDefault(); //previne o refresh no envio de formulário

        let btn = this.formEl.querySelector("[type=submit]");

        btn.disabled = true;

        let values = this.GetValues(); //O problema é que o caminho da imagem
        if (!values) return false;

        this.GetPhoto().then(
          (content) => {
            values.photo = content;
            this.AddLine(values); //ele puxa os valores do get values no parametro
            btn.disabled = false;
            this.formEl.reset();
          },
          (e) => {
            console.error(e);
          }
        );
      }
    );
  }

  GetPhoto() {
    //prommisse para executar função assincrona
    //preparamos o código para 2 situações, o se funcionar ou se falhar
    //no caso o resolve ou reject, bem explicativo
    return new Promise((resolve, reject) => {
      let filereader = new FileReader(); // Colocar o arquivo no let
      let elements = [...this.formEl.elements].filter((item) => {
        //arrow function para achar um item específico do array
        if (item.name === "photo") {
          return item;
          //essa função verifica os campos e pega o valor do photo e retorna como item
        }
      });
      let file = elements[0].files[0]; //O arquivo do element é uma coleção, colocamos index 0 pra peggar o primeiro elemento
      filereader.onload = () => {
        //Onload é uma função anonima que executa algo após um retorno, nesse caso, o Item

        resolve(filereader.result);
      };
      filereader.onerror = (e) => {
        reject(e); //esse e retorna o evento do erro
      };
      if (file) {
        filereader.readAsDataURL(file); //ele le os dados como um caminho
      } else {
        resolve("dist/img/Kira.png");
      }
    });
  }

  GetValues() {
    let user = {}; //o Let cria uma var no escopo do método
    let isValid = true;

    /*Colocamos o this.formEl entre arrays para transformar em arrays, para assim o for each funcionar */
    [...this.formEl.elements].forEach(function (field, index) {
      if (
        ["name", "password", "email"].indexOf(
          field.name /*Nome do campo que passar pelo ForEAch*/
        ) > -1 &&
        !field.value /*field que conrtem os valores*/
      ) {
        field.parentElement.classList.add("has-error");

        //parentElement - A classe "pai", ou seja, que contém o form dos campos
        //classList - Conjunto de métodos entre eles o Add
        //haserroe é um template de erro do próprio curso, no caso uma classe CSS
        isValid = false; //retorna False para poder parar o envio do formulário
      }

      //pega todos os campos e  oara cada um executa um if
      /*Esse ... é o spread, ele serve para que não precisemos colocar o número exato de elemnentos de um array*/
      //esse if gender é para caso o campo gender esteja marcado como checked ele puxe os valores dos campos
      // o For Each passa por todos os campos do HTML(pos causa do Elements do FormsEl, que retorna os campos)
      //indexados
      if(field.name == "gender"){
        if (field.checked) {
            user[field.name] = field.value;
        }
    }
     else if (field.name == "admin") {
        user[field.name] = field.checked;
      } else {
        user[field.name] = field.value; //pega os valores mesmo sem check
      }
    });

    if (!isValid) {
      return false;
      //caso nao seja valido(campo vazio) ele para a execução do form
    }
    return new User(
      user.name,
      user.gender,
      user.birth,
      user.country,
      user.email,
      user.password,
      user.photo,
      user.admin
    );

    //essa função foi criada para passar por todos os fields e pegar os valores
  }

  AddLine(dataUser) {
    let tr = document.createElement("tr");
    tr.dataset.user /*nome usado pra guardar, tipo uma var*/ = JSON.stringify(
      dataUser
    ); //valores recebidos
    //o JSON seirializa o obj(tranforma em string)
    tr.innerHTML =
      //Colocamos o TableId para ele receber o Id da tabela toda
      //inserir comanbdos no HTML
      `  
      <td><img src="${
        dataUser.photo
      }" alt="User Image" class="img-circle img-sm"></td>
      <td>${dataUser.name}</td>
      <td>${dataUser.email}</td>
      <td>${dataUser.admin ? "Yes Yes Yes!" : " No no no"}</td>
      <td>${Util.dateFormat(dataUser.register)}</td>
      <td>
        <button type="button" class="btn btn-primary btn-edit btn-xs btn-flat">Editar</button>
        <button type="button" class="btn btn-danger btn-xs btn-flat">Excluir</button>
      </td>
    `;

    tr.querySelector(".btn-edit").addEventListener("click", (e) => {
      let json = JSON.parse(tr.dataset.user); //JSON são as propriedades de objetos porém não mais instanciados
      let form = document.querySelector("#form-user-update"); //pega o formulpario de update
      for (let name in json) {
        //name é a variável que recebe o nome da propriedade

        let field = form.querySelector("[name= " + name.replace("_", "") + "]");
        //aqui ele vai entrar no JSON, ir de propridade em propriedade e recebe os campos que tem um nome
        //igual ao que aparece no JSON, no caso a propriedade
        // o replace pega os _ e troca por nada

        if (field) {
         
          switch (field.type) {
            case 'file':
               continue;
           
            
              

               case 'radio' :
                 field = form.querySelector("[name= " + name.replace("_", "") + "][value=" + json[name] + "]");
                 field.checked = true;
                 //aqui ele sobreescreve a variável tornando o valor igual ao nome que ele está procurando
               break;
               case 'checkbox' :
             field.checked = true; //os checkeds são convertidos em boolean, então isto vai manter o checked
             //feito igual a true então ele ficará marcado
               break;
           
          
             default:
               field.value = json[name];
             
          }
         
          //aqui nós afirmamos que o valor que o field vai receber é o do json na propriedade name
        }
      }

      //aqui nesse função foi criado um eventlistenner do botão de editar que quando é clicado retorna a tr
      //da linha que foi clicada
      this.showPanelUpdate();
      // this.showPanelUpdate();
    });

    this.TableEl.appendChild(tr);

    this.updateCount();
  }

  showPanelUpdate() {
    document.querySelector("#box-user-create").style.display = "none";
    document.querySelector("#box-user-update").style.display = "block";
  }

  showPanelCreate() {
    document.querySelector("#box-user-create").style.display = "block";
    document.querySelector("#box-user-update").style.display = "none";
  }

  updateCount() {
    //método que serve para contar as linhas
    let numberUsers = 0;
    let numberAdmins = 0;

    [...this.TableEl.children].forEach((tr) => {
      //ele entra dentro do array de tableEl(literalmente o HTML todo)
      //e pega os "filhos", e para cada filho ele aumenta um numero no let user caso seja cadastrado um user
      numberUsers++;
      let user = JSON.parse(tr.dataset.user);
      //o parse aqui converte a string em obj

      if (user._admin /* por padrão é true , o _admin vem do users/getters*/)
        numberAdmins++;
    });
    document.querySelector("#number-users-admin").innerHTML = numberAdmins;
    document.querySelector("#number-users").innerHTML = numberUsers;
  }
  // document.getElementById('table-user').appendChild(tr); //pegar a table do HTML
}
