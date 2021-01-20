const timeout = process.env.SLOWMO ? 30000 : 10000;

beforeAll(async () => {
  await page.goto(URL, { waitUntil: "domcontentloaded" });
});

describe("Page basics", () => {
  test(
    "Title matches",
    async () => {
      const title = await page.title();
      expect(title).toBe("Diego Sanz");
    },
    timeout
  );

  test(
    "Take screenshot of home page",
    async () => {
      await page.setViewport({ width: 1920, height: 1080 });
      await page.screenshot({
        path: "./e2e/screenshots/home.png",
        fullPage: true,
        type: "png",
      });
    },
    timeout
  );
});

describe("Range move controls", () => {
  test(
    "move min control increments value",
    async () => {
      await page.setViewport({ width: 1920, height: 1080 });
      await page.goto("http://localhost:8080/exercise1");
      await page.waitForSelector(".range__bar__control.m-min");

      const inputMin = await page.$('[aria-label="range input min"]');
      const inputMax = await page.$('[aria-label="range input max"]');

      const controlMin = await page.$('[aria-label="range control min"]');
      const controlMax = await page.$('[aria-label="range control max"]');

      const controlMinBox = await controlMin.boundingBox();
      const controlMaxBox = await controlMax.boundingBox();

      if (controlMaxBox) {
        const height = controlMaxBox.y + controlMaxBox.height / 2;
        await page.mouse.move(
          controlMaxBox.x + controlMaxBox.width / 2,
          height
        );
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
    },
    timeout
  );

  test(
    "values should be 0 if dony have data from API",
    async () => {
      await page.setViewport({ width: 1920, height: 1080 });
      await page.goto("http://localhost:8080/exercise1");
      await page.waitForSelector(".range__bar__control.m-min");

      await page.setRequestInterception(true);
      const requestInterceptor = (interceptedRequest) => {
        if (
          interceptedRequest
            .url()
            .startsWith("https://demo5808070.mockable.io/min-max")
        ) {
          interceptedRequest.abort();
        } else {
          interceptedRequest.continue();
        }
      };
      page.on("request", requestInterceptor);
      page.removeListener("request", requestInterceptor);
      await page.setRequestInterception(false);

      const inputMin = await page.$('[aria-label="range input min"]');
      const inputMax = await page.$('[aria-label="range input max"]');

      const controlMin = await page.$('[aria-label="range control min"]');
      const controlMax = await page.$('[aria-label="range control max"]');

      const controlMinBox = await controlMin.boundingBox();
      const controlMaxBox = await controlMax.boundingBox();

      if (controlMaxBox) {
        const height = controlMaxBox.y + controlMaxBox.height / 2;
        await page.mouse.move(
          controlMaxBox.x + controlMaxBox.width / 2,
          height
        );
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

      expect(await page.evaluate((e) => e.value, inputMin)).toBe("0");
      expect(await page.evaluate((e) => e.value, inputMax)).toBe("0");
    },
    timeout
  );
});
