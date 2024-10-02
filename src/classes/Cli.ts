// Importing required modules and vehicle classes.
import inquirer from "inquirer";
import Truck from "./Truck.js";
import Car from "./Car.js";
import Motorbike from "./Motorbike.js";
import Wheel from "./Wheel.js";

class Cli {
  vehicles: (Car | Truck | Motorbike)[]; // TODO: Update to support additional vehicle types in the future
  selectedVehicleVin: string | undefined; // Track currently selected vehicle by VIN
  exit: boolean = false; // Controls the CLI loop

  // Constructor to initialize the list of vehicles.
  constructor(vehicles: (Car | Truck | Motorbike)[]) {
    this.vehicles = vehicles;
  }

  // Static method to generate a random VIN for new vehicles.
  static generateVin(): string {
    // TODO: Add validation or ensure uniqueness for generated VINs if necessary
    return (
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15)
    );
  }

  chooseVehicle(): void {
    inquirer
      .prompt([
        {
          type: "list",
          name: "selectVechile",
          message: "Select a vehicle to perform and action on",
          choices: this.vehicles.map((vehicle) => {
            return {
              name: `${vehicle.vin} -- ${vehicle.make} ${vehicle.model}`,
              value: vehicle.vin,
            };
          }),
        },
      ])
      .then((answers) => {
        // set sVIN to the vin of the selected vehicle
        this.selectedVehicleVin = answers.vehicle.vin;
        // perform actions on the selected vehicle
        this.performActions();
      });
  }

  // Method to create a new vehicle by prompting the user to select a vehicle type.
  createVehicle(): void {
    inquirer
      .prompt([
        {
          type: "list",
          name: "vehicleType",
          message: "Select a vehicle type",
          choices: ["Car", "Truck", "Motorbike"], // TODO: Add additional vehicle types here in the future
        },
      ])
      .then((answers) => {
        if (answers.vehicleType === "Car") {
          this.createCar();
        } else if (answers.vehicleType === "Truck") {
          this.createTruck();
        } else if (answers.vehicleType === "Motorbike") {
          this.createMotorbike();
        }
        // TODO: Handle any future vehicle types
      });
  }

  // Method to create a new car.
  createCar(): void {
    inquirer
      .prompt([
        { type: "input", name: "color", message: "Enter Color" },
        { type: "input", name: "make", message: "Enter Make" },
        { type: "input", name: "model", message: "Enter Model" },
        { type: "input", name: "year", message: "Enter Year" },
        { type: "input", name: "weight", message: "Enter Weight" },
        { type: "input", name: "topSpeed", message: "Enter Top Speed" },
      ])
      .then((answers) => {
        const car = new Car(
          Cli.generateVin(),
          answers.color,
          answers.make,
          answers.model,
          parseInt(answers.year),
          parseInt(answers.weight),
          parseInt(answers.topSpeed),
          [] // TODO: Implement logic for adding wheels in future
        );
        this.vehicles.push(car);
        this.selectedVehicleVin = car.vin;
        this.performActions();
      });
  }

  // Method to create a new truck.
  createTruck(): void {
    inquirer
      .prompt([
        { type: "input", name: "color", message: "Enter Color" },
        { type: "input", name: "make", message: "Enter Make" },
        { type: "input", name: "model", message: "Enter Model" },
        { type: "input", name: "year", message: "Enter Year" },
        { type: "input", name: "weight", message: "Enter Weight" },
        { type: "input", name: "topSpeed", message: "Enter Top Speed" },
        {
          type: "input",
          name: "towingCapacity",
          message: "Enter Towing Capacity",
        },
      ])
      .then((answers) => {
        const truck = new Truck(
          Cli.generateVin(),
          answers.color,
          answers.make,
          answers.model,
          parseInt(answers.year),
          parseInt(answers.weight),
          parseInt(answers.topSpeed),
          [],
          parseInt(answers.towingCapacity)
        );
        this.vehicles.push(truck);
        this.selectedVehicleVin = truck.vin;
        this.performActions();
      });
  }

  // Method to create a new motorbike.
  createMotorbike(): void {
    inquirer
      .prompt([
        { type: "input", name: "color", message: "Enter Color" },
        { type: "input", name: "make", message: "Enter Make" },
        { type: "input", name: "model", message: "Enter Model" },
        { type: "input", name: "year", message: "Enter Year" },
        { type: "input", name: "weight", message: "Enter Weight" },
        { type: "input", name: "topSpeed", message: "Enter Top Speed" },
      ])
      .then((answers) => {
        const motorbike = new Motorbike(
          Cli.generateVin(),
          answers.color,
          answers.make,
          answers.model,
          parseInt(answers.year),
          parseInt(answers.weight),
          parseInt(answers.topSpeed),
          [] // TODO: Add logic for wheels in future if necessary
        );
        this.vehicles.push(motorbike);
        this.selectedVehicleVin = motorbike.vin;
        this.performActions();
      });
  }

  // Method to perform various actions with the selected vehicle.
  performActions(): void {
    const selectedVehicle = this.vehicles.find(
      (vehicle) => vehicle.vin === this.selectedVehicleVin
    );
    if (!selectedVehicle) {
      console.log("No vehicle selected.");
      return;
    }

    // Provide a list of actions based on the vehicle type.
    const actions = ["View Details", "Exit"];
    if (selectedVehicle instanceof Truck) {
      actions.push("Tow Vehicle");
    } else if (selectedVehicle instanceof Motorbike) {
      actions.push("Perform Wheelie");
    }

    inquirer
      .prompt([
        {
          type: "list",
          name: "action",
          message: "Select an action to perform",
          choices: actions,
        },
      ])
      .then((answer) => {
        if (answer.action === "View Details") {
          selectedVehicle.printDetails();
        } else if (
          answer.action === "Tow Vehicle" &&
          selectedVehicle instanceof Truck
        ) {
          this.towVehicle(selectedVehicle as Truck);
        } else if (
          answer.action === "Perform Wheelie" &&
          selectedVehicle instanceof Motorbike
        ) {
          this.performWheelie(selectedVehicle as Motorbike);
        } else if (answer.action === "Exit") {
          this.exit = true;
          console.log("Exiting...");
        }
        // TODO: Add more actions as vehicle functionality expands
        if (!this.exit) this.performActions();
      });
  }

  // method to start CLI
  startCli(): void {
    inquirer
      .prompt([
        {
          type: "list",
          name: "option",
          message:
            "Would you like to create a new vehicle or perform an action on an existing vehicle?",
          choices: ["Create a new Vehicle", "Select and existing vehicle"],
        },
      ])
      .then((answers) => {
        if (answers.option === "Create a new Vehicle") {
          this.createVehicle();
        } else {
          this.chooseVehicle();
        }
      });
  }

  // Method for Truck to tow another vehicle.
  towVehicle(truck: Truck): void {
    inquirer
      .prompt([
        {
          type: "list",
          name: "vehicleToTow",
          message: "Select a vehicle to tow",
          choices: this.vehicles
            .filter((vehicle) => vehicle.vin !== truck.vin)
            .map(
              (vehicle) => `${vehicle.vin} - ${vehicle.make} ${vehicle.model}`
            ),
        },
      ])
      .then((answer) => {
        const vehicleVin = answer.vehicleToTow.split(" ")[0]; // Extracting VIN
        const vehicleToTow = this.vehicles.find(
          (vehicle) => vehicle.vin === vehicleVin
        );
        if (vehicleToTow) {
          truck.tow(vehicleToTow); // TODO: Add towing action to the vehicle or display additional details
        } else {
          console.log("Vehicle not found.");
        }
      });
  }

  // Method for Motorbike to perform a wheelie.
  performWheelie(motorbike: Motorbike): void {
    motorbike.wheelie(); // TODO: Add any additional wheelie functionality if needed
  }
}

export default Cli;
