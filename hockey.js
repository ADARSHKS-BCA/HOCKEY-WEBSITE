const fs = require('fs');
const fileName = "hockey-data.txt";

fs.writeFile(fileName, "Hockey Team: Ice Warriors\nCaptain: John Doe\nWins: 10\nLosses: 2\n", (err) => {
    if (err) throw err;
    console.log("File created and data written successfully.");

    fs.open(fileName, 'r+', (err, fd) => {
        if (err) throw err;
        console.log("File opened successfully.");

        fs.readFile(fileName, 'utf8', (err, data) => {
            if (err) throw err;
            console.log("File Content:\n" + data);

            fs.appendFile(fileName, "Next Match: Ice Warriors vs Storm Riders\n", (err) => {
                if (err) throw err;
                console.log("New data appended.");

                fs.close(fd, (err) => {
                    if (err) throw err;
                    console.log("File closed successfully.");
                });
            });
        });
    });
});
