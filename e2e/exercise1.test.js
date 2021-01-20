const puppeteer = require("puppeteer");

describe("Range move controls", () => {
  test("move min control increments value", async () => {
    const browser = await puppeteer.launch({
      headless: false,
    });
    const page = await browser.newPage();

    page.emulate({
      viewport: {
        width: 500,
        height: 200,
      },
      userAgent: "",
    });

    await page.goto("http://localhost:8080/exercise1");
    await page.waitForSelector(".range__bar__control.m-min");
    await page.waitForTimeout(3000);
    const inputMin = await page.$('[aria-label="range input min"]');
    const inputMax = await page.$('[aria-label="range input max"]');

    const controlMin = await page.$('[aria-label="range control min"]');
    const controlMax = await page.$('[aria-label="range control max"]');

    const controlMinBox = await controlMin.boundingBox();
    const controlMaxBox = await controlMax.boundingBox();

    if (controlMaxBox) {
      const height = controlMaxBox.y + controlMaxBox.height / 2;
      await page.mouse.move(controlMaxBox.x + controlMaxBox.width / 2, height);
      await page.mouse.down();
      await page.mouse.move(controlMaxBox.x - 600, height);
      await page.mouse.up();
    }

    await inputMax.focus();
    await inputMax.click({ clickCount: 3 });
    await page.keyboard.type("33");

    if (controlMinBox) {
      await page.mouse.move(
        controlMinBox.x + controlMinBox.width / 2,
        controlMinBox.y + controlMinBox.height / 2
      );
      await page.mouse.down();
      await page.mouse.move(
        controlMinBox.x + 300,
        controlMinBox.y + controlMinBox.height / 2
      );
      await page.mouse.up();
    }

    const maxValue = await page.evaluate((x) => x.value, inputMax);

    expect(await page.evaluate((e) => e.value, inputMin)).toBe(maxValue);

    browser.close();
  }, 16000);
});
