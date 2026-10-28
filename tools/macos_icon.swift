// Draw the project's existing V/roundel mark at Retina resolution without external dependencies.
import AppKit
let size = NSSize(width: 1024, height: 1024)
let image = NSImage(size: size)
image.lockFocus()
NSColor(calibratedRed: 0, green: 107.0/255, blue: 87.0/255, alpha: 1).setFill()
NSBezierPath(roundedRect: NSRect(x: 0, y: 0, width: 1024, height: 1024), xRadius: 288, yRadius: 288).fill()
func polygon(_ points: [(CGFloat, CGFloat)], _ color: NSColor) {
    let path = NSBezierPath()
    path.move(to: NSPoint(x: points[0].0 * 8, y: (128 - points[0].1) * 8))
    for p in points.dropFirst() { path.line(to: NSPoint(x: p.0 * 8, y: (128 - p.1) * 8)) }
    path.close(); color.setFill(); path.fill()
}
polygon([(26,35),(48,93),(67,93),(46,35)], NSColor(calibratedRed: 216.0/255, green: 248.0/255, blue: 164.0/255, alpha: 1))
polygon([(70,35),(51,93),(71,93),(92,35)], NSColor(calibratedRed: 247.0/255, green: 249.0/255, blue: 239.0/255, alpha: 1))
NSColor(calibratedRed: 1, green: 200.0/255, blue: 126.0/255, alpha: 1).setFill()
NSBezierPath(ovalIn: NSRect(x: 89*8, y: (128-48)*8, width: 18*8, height: 18*8)).fill()
image.unlockFocus()
let bitmap = NSBitmapImageRep(data: image.tiffRepresentation!)!
try bitmap.representation(using: .png, properties: [:])!.write(to: URL(fileURLWithPath: CommandLine.arguments[1]))
