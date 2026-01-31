const fs = require('fs');
const path = require('path');

const baseDir = path.join(process.cwd(), 'public', 'example');
const result = {};

const folders = ['AA83-7', 'AAL839-6', 'AB028-6'];

folders.forEach(folder => {
    const folderPath = path.join(baseDir, folder);
    if (fs.existsSync(folderPath)) {
        const files = fs.readdirSync(folderPath)
            .filter(f => f.toLowerCase().endsWith('.jpeg') || f.toLowerCase().endsWith('.jpg'));

        // Sort by RUN number
        files.sort((a, b) => {
            const numA = parseInt(a.match(/RUN(\d+)/)[1]);
            const numB = parseInt(b.match(/RUN(\d+)/)[1]);
            return numA - numB;
        });

        const csvPath = path.join(baseDir, `${folder}_phases.csv`);
        const stages = [];
        if (fs.existsSync(csvPath)) {
            const csvContent = fs.readFileSync(csvPath, 'utf8');
            csvContent.split('\n').forEach(line => {
                const parts = line.trim().split(',');
                if (parts.length >= 3) {
                    stages.push({
                        name: parts[0],
                        startFrame: parseInt(parts[1]),
                        endFrame: parseInt(parts[2])
                    });
                }
            });
        }

        result[folder] = {
            id: folder,
            frames: files.map(f => `/example/${folder}/${f}`),
            stages: stages
        };
    }
});

fs.writeFileSync(path.join(baseDir, 'manifest.json'), JSON.stringify(result, null, 2));
console.log('Manifest generated successfully');
