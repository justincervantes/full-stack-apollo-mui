### Harvest-Talent-Builder

This is my final project submission for the Harvest Builders' Samurai Pizza Cat project. Core system functionality was provided by Harvest Builders developers, however testing and functionality around all Pizza related endpoints and components were written by myself.

## running the code:

1. Run `yarn install:all` to install dependencies
1. Run `docker-compose up` to start a local mongo database instance in a docker container
1. Run `yarn seed:database` to seed your local database
1. Run `yarn start` in the root folder to start the client and server in parallel.

Note: Alternatively, you can run `yarn start` for the client and server in separate terminals

## Server Notes

- Every time you update the graphql schema, you will need to `yarn generate:types`

## Client Notes

- Watch the terminal for React warnings, and ensure they are fixed before putting up your pull request

### Troubleshooting

If you are on linux you may get the following error: `Error: ENOSPC: System limit for number of file watchers reached`

#### Solution:

Modify the number of system monitoring files

1. Edit your `sysctl.conf` with `sudo gedit /etc/sysctl.conf`
2. Add the following line at to the bottom `fs.inotify.max_user_watches=524288` then save and exit
3. Verify this changed worked with `sudo sysctl -p`
