//appointment CRUD

/* 
Appointment card should contain:

Name of Pet:
Type of Service:
Time and Date:

options:

Delete Appointment
Change Service 

*/

class Pets {
    constructor(name){
        this.name = name;
        this.newAppointments = [];
        
    }
    //couldn't figure out how to create an appointment ID like in the videos, so I did some research to create random ones based on date and convert to string and passed it as a parameter when a new appointment is pushed to array
    addAppointment = (service, date) => {
        const id = Date.now().toString();
        this.newAppointments.push(new Appointment(id, service, date));
        
    }

}

class Appointment {
    constructor(id, service, date){
        this.id = id;
        this.service = service;
        this.date = date; 
    }
}

//methods for DOM to call on to create a new Pet and new Appointment

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

//render DOM Actions

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
        if (pet.id == petId) {
            for (let appointment of pet.newAppointments) {
                if (appointment.id == appointmentId) {
                    pet.newAppointments.splice(pet.newAppointments.indexOf(appointment), 1);
                    PetServices.updatePet(pet)
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
                    <h2>${pet.name}</h2>
                    <button class="btn btn-dark" onclick="DOM.deletePet('${pet.id}')">Remove Pet</button>
                 </div>
                  <div class="card-body">
                    <div class="card">
                        <div class="row g-2">                         
                            <div class="col-md">
                                <label for="date input" class="m-2">Services</label>
                                    <select id="${pet.id}-service" class="form-select" name="services" placeholder="Service">
                                    <option selected>Select an Option</option>
                                    <option value = "Haircut Only">Haircut Only</option>
                                    <option value = "Wash Only">Wash Only</option>
                                    <option value = "Cut and Wash">Cut and Wash</option>
                                    <option value = "Quick Trim and Wash">Quick Trim and Wash</option>
                                    </select>
                            </div>

                            <div class="col-md">
                                <label for="date input" class="m-2">Requested Appointment Date</label>
                                <input type="date" id="${pet.id}-date" class="form-control" placeholder="Appointment Date">
                            </div>
                        </div>
                            <button id="${pet.id}-new-appointment" onclick="DOM.addAppointment('${pet.id}')" class="btn btn-primary form-control mt-2">Add</button>
                    </div>

                  </div>
                </div><br>`    
            );
            for (let appointment of pet.newAppointments) {
                $(`#${pet.id}`).find('.card-body').append(
                    `
                    <p>
                        <span class="blockquote" id="name-${pet.id}"><strong>Service: </strong> ${appointment.id}</span>
                        <span class="blockquote" id="appointment-${appointment.id}"><strong>Date: </strong> ${appointment.service}</span>
                        <button class="btn btn-dark m-2" onclick="DOM.deleteAppointment('${pet.id}', '${appointment.id}')">Delete Appointment</button>
                    </p>
                    `
                );
                
            }
            
        }

    }
}
document.getElementById('create-new-card').addEventListener('click', ()=>{
    DOM.newPet($('#new-appointment-name').val());
    $('#new-appointment-name').val('');
});

DOM.getAllPets();