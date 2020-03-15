# LucharAlVirus

Hey! Welcome to the LucharAlVirus initiative codebase. This document is heavily under development - as it is the system and tool - so please pardon any possible incoherence. Just contact me if want to jump in and you don't find where to start

## What is this?

This is a rapid development effort to enable people to get in touch together and help each other in this crisis times. At this moment, it has these main focuses:

* Provide condition tracking capabilities for patients that believe may been affected by the virus
* Enable a volunteer marketplace for individuals in higher-risk profiles to receive assistance on daily tasks. These daily tasks include:
* * **Groceries:** Grocery requests can be posted, and fulfilled by volunteers.
* * **Other requests:** Open-form requests, that do not match any type above. More formal types shall be created over time.
* Provide **doctors** and **patients** with a mechanism they can reach easily use to reach to each other, to discuss medical conditions that are not urgent, and that can be discussed remotely.
* Provide a **feedback mechanism** to enable everybody to propose changes, improvements and additions into the tool.

## How does it work?

This tool understand four different personas:

* **Risk profile individuals**: People that match any of the conditions for being part of the high-risk group. Individuals in this group will be empowered with capabilities for requesting assistance by volunteers.
* **Volunteers**: Individuals willing to offer their time and dedication to assist fellow citizens in high-risk groups.
* **Patients**: Individuals that request medical assistance.
* **Doctors**: Medical specialists that provide medical assistance.

Each profile will register using slightly different fields, to best match the requirements the system has to fulfill each of the types of their potential requests.

## How is it built

All system - architecture, software, proceedures - have been open sourced to maximize collaboration among people. Please check the [CONTRIBUTE](#contribute) section below for some guidelines on contributions.

The system is built using **Amazon Web Services** technologies for infrastructure, **Vue.js** for front-end code, and some **Node.js** SDKs and tools to provide functionality, and connectivity among layers. 

### Registration system

The registration system takes care of all user registrations, independently of their persona or role. It will simply store the user-provided information into a table, which will immediately trigger an automatic registration procedure, to create the individual's user. The system then sends an SMS to the user, which will include a code. Such code must be entered in the UI for the account to be confirmed.

![Registration system](/static/registration.png)

### Technical flows

Once the user is registered and confirmed, and depending on their role, different procedures will be applicable. Such procedures will be available via Phone, SMS, and through the web application.

![Procedures](/static/procedures.png)

#### Assistance requests
