# Abuse Bayes Server

The Abuse Bayes server is a simple [`express`](http://expressjs.com/) app that classifies strings sent to it.

It needs [redis](http://redis.io/) and [node](nodejs.org) to run.

## Getting Started

To get started, clone the source:

```
git clone git@github.com:simonv3/abuse-bayes-server.git
```

Move to the newly created directory:

```
cd abuse-bayes-server
```

Install the necessary packages

```
npm install
```

And then run the server:

```
node app.js
```

You can access the api in your browser at `localhost:3000/api/v1/classify/`, which will tell you to POST to a string to it to get a result. Use a plug in like [REST Easy](https://addons.mozilla.org/en-US/firefox/addon/rest-easy/?src=search) to test with a POST request.

## Training Your Server

You need an abuse text corpus and a normal text corpus. Then

```
node trainer/trainer.js <ABUSE.TXT> <NORMAL.TXT>
```

This will use the redis backend to train your server.


### Installing Redis

If you're on a mac - use homebrew! `brew install redis`. Else, I don't know!

It will give you instructions on how to get it running on launch.

## Future

* [ ] Make classify accept multiple text strings to limit amount of queries
* [ ] Create a train endpoint
* [ ] Make a "not sure" page
* [ ] Split up app into not just one page cause common
