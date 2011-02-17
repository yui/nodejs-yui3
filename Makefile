
install: deps
	@./scripts/install.sh

deps: ./scripts/deps.sh

bare: deps
	@./scripts/make_package.sh bare

base: deps
	@./scripts/make_package.sh base

full: deps
	@./scripts/make_package.sh full
	cp ./build/full/package.json ./

all: deps
	@./scripts/make_package.sh bare
	@./scripts/make_package.sh base
	@./scripts/make_package.sh full

publish: deps install test
	@./scripts/publish.sh

test: deps
	@./scripts/test.sh

clean:
	rm -rRf ./build/

.PHONY: install test bare
