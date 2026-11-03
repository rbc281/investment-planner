# Investment Planner

TimeProof USA customer-facing price and payment presentation.

Live site: https://timeproof-investment-planner.roger-chong.chatgpt.site

## Run
Serve `dist/` with a static web server. No dependencies or backend required.
Generate the self-contained offline page with `python make-offline.py`, then open `dist/investment-planner-offline.html`.

## Use
Enter retail price. Tap One Year Investment to select savings in any order. Applied rows have removal controls. $ off project and % off project add blank editable fields; both can be used together. Percentages always use original retail. Settings renames all five options.

Payment estimates use 9.95% APR over 180 months on discounted price less down payment, rounded up to whole dollars. Promotional terms should match lender disclosures.

## Checks
Run `node test.cjs`. Tablet-responsive layouts include iPad Pro portrait/landscape sizing and 44px touch targets. No customer amounts are stored or sent to servers.

Source on GitHub; current live hosting is Sites. GitHub commits do not automatically deploy to Sites.
