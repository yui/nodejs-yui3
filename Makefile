all: deps clean
	@./scripts/make_package.sh bare
	@./scripts/make_package.sh base
	@./scripts/make_package.sh full

full: deps
	@./scripts/make_package.sh full
	cp ./build/full/package.json ./


bare: deps
	@./scripts/make_package.sh bare

base: deps
	@./scripts/make_package.sh base

publish: deps install test
	@./scripts/publish.sh

test: deps
	@./scripts/test.sh

install: deps
	@./scripts/install.sh

deps: ./scripts/deps.sh

clean:
	rm -rRf ./build/

help:
	@cat ./INSTALL

.PHONY: all install test bare base full publish clean deps test help
