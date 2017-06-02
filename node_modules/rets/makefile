REPORTER = list
JSON_FILE = static/all.json
HTML_FILE = static/coverage.html

test-all: clean document lib-cov test-code

document:
	yuidoc -q

test-code:
	@NODE_ENV=test mocha \
  --timeout 200 \
  --ui exports \
  --reporter $(REPORTER) \
  test/*.js

test-cov: lib-cov
	@APP_COVERAGE=1 $(MAKE) test \
	REPORTER=html-cov > $(HTML_FILE)

lib-cov:
	jscoverage lib static/lib-cov

clean:
	rm -rf static/lib-cov
	rm -rf static/assets
	rm -rf static/classes
	rm -rf static/files
	rm -rf static/modules
	rm -f static/api.js
	rm -f static/data.json
	rm -f static/index.html
