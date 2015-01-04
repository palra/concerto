SRC = ./index.js ./Component/*
SPECS = ./**/Test/**/*.spec.js
MOCHAOPTS = --require should --reporter spec --ui bdd
MOCHAEXEC = ./node_modules/.bin/_mocha
ISTEXEC = ./node_modules/.bin/istanbul
DOCEXEC = ./node_modules/.bin/jsdoc
DOCOPTS = -r --verbose -d ./docs
DOCWATCH = 2

test:
	$(MOCHAEXEC) $(MOCHAOPTS) $(SPECS)

test-watch:
	$(MOCHAEXEC) $(MOCHAOPTS) -w $(SPECS)

coverage:
	$(ISTEXEC) cover $(MOCHAEXEC) -- $(MOCHAOPTS) $(SPECS)

send-coverage:
	./node_modules/.bin/istanbul cover ./node_modules/.bin/_mocha \
	--report lcovonly -- $(MOCHAOPTS) $(SPECS) && \
	CODECLIMATE_REPO_TOKEN=3e07936aba63bcce9e527ce5aa37687ed4ff28e5493f2fb4214fefc4dcdc22f5 \
	./node_modules/.bin/codeclimate < ./coverage/lcov.info && rm -rf ./coverage

doc:
	$(DOCEXEC) $(DOCOPTS) $(SRC)

doc-watch:
	watch -n $(DOCWATCH) make doc

.PHONY: test coverage