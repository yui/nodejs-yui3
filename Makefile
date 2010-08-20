all: install

bootstrap:
	./scripts/bootstrap.sh

dev:
	./scripts/dev.sh

publish:
	./scripts/publish.sh


install: bootstrap
	npm install .

link: bootstrap
	npm link .

