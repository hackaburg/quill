# Quill

Quill is a registration system designed especially for hackathons. For hackers, it’s a clean and streamlined interface to submit registration and confirmation information. For hackathon organizers, it’s an easy way to manage applications, view registration stats, and more!

For a more detailed readme, check out the [source repository](https://github.com/techx/quill).

### Deploying locally using Docker

For testing purposes, it's sometimes easier to deploy Quill to a local docker setup. To do so, you can use the preconfigured [docker-compose.yml](docker-compose.yml), to get up and running even faster!

- Quill is being proxied through NGINX on port 8080, in case you'll later want to use a custom url
- [Maildev](https://github.com/djfarrelly/MailDev) is running on port 8081, so you can debug those emails
- Also, [mongo-express](https://github.com/mongo-express/mongo-express) listens on port 8082, in case you need to directly modify some data

### Troubleshooting Docker

Initially, you need to install Quill's dependencies. If you're on a Mac or Windows machine and installed the dependencies from your local shell, you won't be able to start the Quill container as SASS and other dependencies are downloaded as platform-dependent binaries. To install the dependencies in a "Docker compatible" way (i.e. from inside a container), use the [`run-in-node-container.sh`](run-in-node-container.sh) script instead:

```bash
$ ./run-in-node-container.sh yarn install
$ ./run-in-node-container.sh yarn bower install
```

Quill requires environment variables to be present, so make sure you `cp .env.example .env` before running `docker-compose up`.

Additionally, some services might take some time: Mongo might be slow during the first run, causing mongo-express to fail. Once Mongo is up and running, restart your services.

When updating [`nginx.conf`](nginx.conf), you might want to `docker-compose exec proxy nginx -s reload` to reload the configuration.

# License

Copyright (c) 2015-2016 Edwin Zhang (https://github.com/ehzhang). Released under AGPLv3. See [`LICENSE.txt`][license] for details.

[contribute]: https://github.com/techx/quill/blob/master/CONTRIBUTING.md
[license]: https://github.com/techx/quill/blob/master/LICENSE.txt
[email]: mailto:quill@hackmit.org
[users]: https://github.com/techx/quill/wiki/Quill-Users
