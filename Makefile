all: install

bootstrap:
	./scripts/bootstrap.sh

dev:
	./scripts/dev.sh

publish: bootstrap
	npm publish .

install: bootstrap
	npm install .

link: bootstrap
	npm link .

