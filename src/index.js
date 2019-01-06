import * as React from "react";

const radius = 4;

const times = (n, func) =>
  Array(n)
    .fill(null)
    .map((_, i) => func(i));

const initFirework = (width, height) => {
  return {
    x: Math.floor(Math.random() * width),
    y: height,
    age: 0,
    phase: "fly",
  };
};

const generateSparks = maxSparks => {
  return times(maxSparks, i => {
    const vx = Math.random() * 5 + 0.5;
    const vy = Math.random() * 5 + 0.5;

    return {
      vx: Math.random() > 0.5 ? -vx : vx,
      vy: Math.random() > 0.5 ? -vy : vy,
      weight: Math.random() * 0.3 + 0.03,
      red: Math.floor(Math.random() * 2),
      green: Math.floor(Math.random() * 2),
      blue: Math.floor(Math.random() * 2),
    };
  });
};

const generateFireworks = (width, height, maxFireworks, maxSparks) => {
  return times(maxFireworks, i => {
    return {
      ...initFirework(width, height),
      sparks: generateSparks(maxSparks),
    };
  });
};

const toRGBA = (r, g, b = 0, a = 1) => `rgba(${[r, g, b, a].join(",")})`;

const fill = (ctx, x, y, colors) => {
  ctx.beginPath();
  ctx.fillStyle = toRGBA(...colors);
  ctx.rect(x, y, radius, radius);
  ctx.fill();
};

const draw = (ctx, { phase, sparks, age, x, y }, index) => {
  if (phase === "explode") {
    sparks.forEach(spark => {
      times(10, i => {
        const trailAge = age + i;
        const fade = i * 20 - age * 2;
        fill(
          ctx,
          x + spark.vx * trailAge,
          y + spark.vy * trailAge + (spark.weight * trailAge) ** 2,
          ["red", "green", "blue"].map(key => Math.floor(spark[key] * fade)),
        );
      });
    });
  } else {
    times(15, i => {
      fill(ctx, x + Math.random() * i - i / 2, y + i * radius, [index * 50, i * 17]);
    });
  }
};

const update = (width, height, firework) => {
  if (firework.phase === "explode") {
    const others = firework.age > 100 && Math.random() < 0.05 ? initFirework(width, height) : {};
    return { ...firework, age: firework.age + 1, ...others };
  } else {
    const phase = Math.random() < 0.001 || firework.y < 200 ? "explode" : firework.phase;
    return { ...firework, y: firework.y - 10, phase };
  }
};

const Fireworks = () => {
  const canvas = React.useRef(null);
  const width = 800;
  const height = 500;
  const maxFireworks = 5;
  const maxSparks = 50;
  const [fireworks, updator] = React.useState(
    generateFireworks(width, height, maxFireworks, maxSparks),
  );

  React.useEffect(() => {
    const context = canvas.current.getContext("2d");
    let frameId = null;

    const explode = () => {
      context.clearRect(0, 0, width, height);
      updator(
        fireworks.map((firework, index) => {
          draw(context, firework, index);
          return update(width, height, firework);
        }),
      );
      frameId = window.requestAnimationFrame(explode);
    };
    frameId = window.requestAnimationFrame(explode);

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  });

  return <canvas ref={canvas} width={width} height={height} />;
};

export default Fireworks;
