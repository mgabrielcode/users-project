class UserController {
    constructor(formId, tableId){
        this.formEl = document.getElementById(formId);
        this.tableEl = document.getElementById(tableId)
        this.onSubmit();
    }

    onSubmit(){
        this.formEl.addEventListener("submit", event => {
            event.preventDefault();
            let values = this.getValues();

            this.getPhoto()
                .then((content)=>{
                        values.photo = content;
                        this.addLine(values);
                    },
                    (e)=> {
                        console.error(e)
                    }
                )
        });
    };


    getValues(){
        let user = {};

        //Operator Spread
        [...this.formEl.elements].forEach(function(field){
            if (field.name === "gender") {
                if (field.checked) {
                    user[field.name] = field.value
                }
            } else if(field.name == "admin") {
                user[field.name] = field.checked;
            }
            else {
                user[field.name] = field.value
            }
        });
   
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
    }

    getPhoto(){
        //utilizando promises
        return new Promise ((resolve, reject)=> {
            let fileReader = new FileReader();
            let elements = [...this.formEl.elements].filter((item) => {
                if (item.name === 'photo')
                    return item;
            })
            let file = elements[0].files[0]; //pega o primeior elemento e o primeiro arquivo da coleção
            fileReader.onload = ()=> {
                resolve(fileReader.result);
            }

            fileReader.onerror = ()=>{
                reject(e);
            }

            if(file){
                fileReader.readAsDataURL(file);
            } else {
                resolve('/dist/img/boxed-bg.jpg');
            }
        })
    }  

    addLine(dataUser){
        let tr = document.createElement('tr')
        tr.innerHTML = `
            <tr>
                <td><img src="${dataUser.photo}" alt="User Image" class="img-circle img-sm"></td>
                <td>${dataUser.name}</td>
                <td>${dataUser.email}</td>
                <td>${(dataUser.admin)? "Sim": "Não"}</td>
                <td>${dataUser.birth}</td>
                <td>
                    <button type="button" class="btn btn-primary btn-xs btn-flat">Editar</button>
                    <button type="button" class="btn btn-danger btn-xs btn-flat">Excluir</button>
                </td>
            </tr>
        `
        this.tableEl.appendChild(tr);
    }
    
}