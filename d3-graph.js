function buildGraphData() {
    const arr = photoList.toArray()
        .sort((a, b) => (a.dateObj || 0) - (b.dateObj || 0));

    const nodes = arr.map((p, i) => ({
        id: p.id,
        label: p.filename,
        index: i
    }));

    const links = [];
    for (let i = 0; i < nodes.length - 1; i++) {
        links.push({
            source: nodes[i].id,
            target: nodes[i + 1].id
        });
    }

    return { nodes, links };
}
function renderNodeGraph() {
    const svg = d3.select("#nodeGraph");
    svg.selectAll("*").remove();

    const width = svg.node().clientWidth;
    const height = svg.node().clientHeight;

    const { nodes, links } = buildGraphData();
    if (!nodes.length) return;

    const simulation = d3.forceSimulation(nodes)
        .force("link", d3.forceLink(links).id(d => d.id).distance(60))
        .force("charge", d3.forceManyBody().strength(-150))
        .force("center", d3.forceCenter(width / 2, height / 2));

    const link = svg.append("g")
        .attr("stroke", "#999")
        .attr("stroke-opacity", 0.6)
        .selectAll("line")
        .data(links)
        .join("line");

    const node = svg.append("g")
        .selectAll("circle")
        .data(nodes)
        .join("circle")
        .attr("r", 8)
        .attr("fill", "#0d6efd")
        .call(drag(simulation))
        .on("click", (_, d) => focusOnPhoto(d.id));

    const label = svg.append("g")
        .selectAll("text")
        .data(nodes)
        .join("text")
        .text(d => d.index + 1)
        .attr("font-size", "10px")
        .attr("dx", 12)
        .attr("dy", 4);

    simulation.on("tick", () => {
        link
            .attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y);

        node
            .attr("cx", d => d.x)
            .attr("cy", d => d.y);

        label
            .attr("x", d => d.x)
            .attr("y", d => d.y);
    });
}
function drag(simulation) {
    return d3.drag()
        .on("start", event => {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            event.subject.fx = event.subject.x;
            event.subject.fy = event.subject.y;
        })
        .on("drag", event => {
            event.subject.fx = event.x;
            event.subject.fy = event.y;
        })
        .on("end", event => {
            if (!event.active) simulation.alphaTarget(0);
            event.subject.fx = null;
            event.subject.fy = null;
        });
}
