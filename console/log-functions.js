import Table from "cli-table3";
import chalk from "chalk";

export function logTable(headers, ...rows) {
  // Create a new table with the provided headers
  const table = new Table({
    head: headers.map((header) => chalk.blue(header)), // color the headers blue
  });

  // Style the table text
  for (let row of rows) {
    table.push(
      row.map((cell) => {
        switch (true) {
          case cell === "Active" || cell === "Up" || cell === "Connected":
            return chalk.green(cell);
          case cell === "Initialized" || cell === "Building":
            return chalk.yellow(cell);
          case cell === "Inactive" || cell === "Down" || cell === "Error":
            return chalk.red(cell);
          case typeof cell === "number":
            return chalk.magentaBright(cell);
          case typeof cell === "string":
            return chalk.whiteBright(cell);
          default:
            return cell;
        }
      })
    );
  }

  // Log the table to the console
  console.log(table.toString());
}
