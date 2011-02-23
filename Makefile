all: deps clean bare base full

full: deps
	@./scripts/make_package.sh full
	cp ./build/full/package.json ./


bare: deps
	@./scripts/make_package.sh bare

base: deps
	@./scripts/make_package.sh base

publish: deps install test
	@./scripts/publish.sh

dev: deps clean full install
	@echo "make clean && make full && make install: DONE"

test: deps
	@./scripts/test.sh

tests: test
isntall: install

install: deps
	@./scripts/install.sh

deps: ./scripts/deps.sh

clean:
	rm -rRf ./build/

help:
	@cat ./INSTALL

.PHONY: all install test bare base full publish clean deps test help
