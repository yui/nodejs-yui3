all: install

bootstrap:
	./scripts/bootstrap.sh

dev:
	./scripts/dev.sh

publish:
	./scripts/publish.sh


install: bootstrap
	./scripts/install.sh

link: bootstrap
	npm link .

