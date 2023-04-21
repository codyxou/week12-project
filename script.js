//appointment CRUD

/* 
Appointment card should contain:

Name of Pet:
Contact #
Type of Service:
Time and Date:
Human: 

options:

Delete Appointment
Update Appointment Time 
Change Service 

*/

class Pets {
    constructor(name){
        this.name = name;
        this.newAppointments = [];
        
    }
    addAppointment = (service, date) => {
        this.newAppointments.push(new Appointment(service, date));
    }
    
}




class Appointment {
    constructor(service, date){
        this.service = service;
        this.date = date; 
    }
}



class PetServices {

    static APIURL = 'https://6441ae8376540ce2257c82cd.mockapi.io/pupnsuds/info';

    static getAllPets(){
        return $.get(this.APIURL);
    }
    

    static getPet(id){
        return $.get(this.APIURL + `/${id}`);
    }


    static newPet(pets) { 
        return $.post(this.APIURL, pets);
    }
   
    static updatePet(pets) { 
        return $.ajax({
            url: this.APIURL +  `/${pets.id}`,
            dataType: 'json',
            data: JSON.stringify(pets),
            contentType: 'application/json',
            type: 'PUT'

        });
    }

    static deletePet(id){
        return $.ajax({
            url: this.APIURL +  `/${id}`,
            type: 'DELETE'

        });
    }
}

//render DOM 

class DOM {
    static pets; //represents all pets within DOM 

    static getAllPets(){
        PetServices.getAllPets().then(pets => this.render(pets));
    }

    static newPet(name) {
        PetServices.newPet(new Pets(name))
        .then(() => {
            return PetServices.getAllPets();
        })
        .then((pets) => this.render(pets));
    }

    static deletePet(id) {
        PetServices.deletePet(id)
        .then(() => {
            return PetServices.getAllPets();
        })
        .then((pets) => this.render(pets));
    }

    static addAppointment(id) {
        for (let pet of this.pets) {
            if (pet.id == id) {
                pet.newAppointments.push(new Appointment ($(`#${pet.id}-service`).val(), $(`#${pet.id}-date`).val()));
                PetServices.updatePet(pet)
                    .then(() => {
                    return PetServices.getAllPets();
                    })
                    .then((pets) => this.render(pets));
                
            
        }
    }
}

static deleteAppointment(petId, appointmentId) {
    for (let pet of this.pets) {
        if (pets.id == petId) {
            for (let appointment of pets.newAppointments) {
                if (appointment.id == appointmentId) {
                    pets.newAppointments.splice(pet.newAppointments.indexOf(appointment), 1);
                    PetServices.updateAppointment(pet)
                    .then(() => {
                    return PetServices.getAllPets();
                    })
                    .then((pets) => this.render(pets));

                }
            }
        }
    }
}

    //want to render cards, need to replace input with object values (dot notation.) find random pictures of pets to add? 

    static render(pets) {
        this.pets = pets; 
        $('#pupnsuds-appointments').empty();
        for (let pet of pets) {
            $('#pupnsuds-appointments').prepend (
                `
                <div id="${pet.id}" class="card mt-4">
                 <div class="card-header">
                    <h2>${pets.name}</h2>
                    <button class="btn btn-danger" onclick="DOM.deletePet('${pet.id}')">Delete</button>
                 </div>
                  <div class="card-body">
                    <div class="card">
                        <div class="row">
                        <!-- <div class="col-sm">
                                <input type="text" id="${pet.id}-name" class="form-control" placeholder="Pet Name"> 
                            </div>-->
                            
                            <div class="col-sm">
                            <select id="${pet.id}-service" class="form-control" name="services" placeholder="Service">
                            <option value = "Haircut Only">Haircut Only</option>
                            <option value = "Wash Only">Wash Only</option>
                            <option value = "Cut and Wash">Cut and Wash</option>
                            <option value = "Quick Trim and Wash">Quick Trim and Wash</option>
                            </select>
                            </div>

                            <div class="col-sm">
                            <input type="date" id="${pet.id}-date" class="form-control" placeholder="Appointment Date">
                            </div>
                        </div>
                            <button id="${pets.id}-new-appointment" onclick="DOM.addAppointment('${pets.id}')" class="btn btn-primary form-control mt-2">Add</button>
                    </div>

                  </div>
                </div><br>`    
            );
            // for (let appointment of pet.newAppointments) {
            //     $(`#${pet.id}`).find('.card-body').append(
            //         `
            //         <p>
            //             <span id="name-${pets.id}"><strong>Name: </strong> ${pet.name}</span>
            //             <span id="appointment-${appointment.id}"><strong>Area: </strong> ${pet.name}</span>
            //             <button class="btn btn-danger" onclick="DOM.deleteAppointment('${pets.id}', '${appointment.id}')">Delete Appointment</button>
            //         </p>
            //         `
            //     );
            // }
        }

    }
}
document.getElementById('create-new-card').addEventListener('click', ()=>{
    DOM.newPet($('#new-appointment-name').val());
    $('#new-appointment-name').val('');
});

DOM.getAllPets();