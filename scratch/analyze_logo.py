import zlib
import struct

def paeth_predictor(a, b, c):
    p = a + b - c
    pa = abs(p - a)
    pb = abs(p - b)
    pc = abs(p - c)
    if pa <= pb and pa <= pc:
        return a
    elif pb <= pc:
        return b
    else:
        return c

def analyze_png(filepath):
    with open(filepath, 'rb') as f:
        signature = f.read(8)
        if signature != b'\x89PNG\r\n\x1a\n':
            print("Not a valid PNG file")
            return
        
        idat_data = bytearray()
        width, height, depth, color_type = 0, 0, 0, 0
        
        while True:
            chunk_header = f.read(8)
            if len(chunk_header) < 8:
                break
            length, chunk_type = struct.unpack('>I4s', chunk_header)
            data = f.read(length)
            f.read(4) # CRC
            
            if chunk_type == b'IHDR':
                width, height, depth, color_type, _ = struct.unpack('>IIBBB', data[:11])
            elif chunk_type == b'IDAT':
                idat_data.extend(data)
            elif chunk_type == b'IEND':
                break
                
        decompressed = zlib.decompress(idat_data)
        
        if color_type != 6 and color_type != 2:
            print(f"Unsupported color type: {color_type}")
            return
            
        bytes_per_pixel = 4 if color_type == 6 else 3
        stride = width * bytes_per_pixel
        
        # Recon buffer
        recon = bytearray(height * stride)
        
        for r in range(height):
            filter_type = decompressed[r * (stride + 1)]
            row_start_decomp = r * (stride + 1) + 1
            row_start_recon = r * stride
            
            for c in range(stride):
                filt_val = decompressed[row_start_decomp + c]
                
                # Get neighboring pixels
                a = recon[row_start_recon + c - bytes_per_pixel] if c >= bytes_per_pixel else 0
                b = recon[(r - 1) * stride + c] if r > 0 else 0
                c_prev = recon[(r - 1) * stride + c - bytes_per_pixel] if (r > 0 and c >= bytes_per_pixel) else 0
                
                if filter_type == 0: # None
                    recon_val = filt_val
                elif filter_type == 1: # Sub
                    recon_val = (filt_val + a) & 0xFF
                elif filter_type == 2: # Up
                    recon_val = (filt_val + b) & 0xFF
                elif filter_type == 3: # Average
                    recon_val = (filt_val + (a + b) // 2) & 0xFF
                elif filter_type == 4: # Paeth
                    recon_val = (filt_val + paeth_predictor(a, b, c_prev)) & 0xFF
                else:
                    recon_val = filt_val
                    
                recon[row_start_recon + c] = recon_val
                
        color_counts = {}
        for y in range(height):
            for x in range(width):
                idx = (y * width + x) * bytes_per_pixel
                r = recon[idx]
                g = recon[idx+1]
                b = recon[idx+2]
                a = recon[idx+3] if bytes_per_pixel == 4 else 255
                
                if a > 100: # Opacity threshold
                    # Exclude grayscale colors (whites, blacks, grays)
                    if not (abs(r - g) < 20 and abs(g - b) < 20 and abs(r - b) < 20):
                        color_counts[(r, g, b)] = color_counts.get((r, g, b), 0) + 1
                        
        sorted_colors = sorted(color_counts.items(), key=lambda x: x[1], reverse=True)
        print(f"Top 10 Colors for {filepath}:")
        for color, count in sorted_colors[:15]:
            hex_color = f"#{color[0]:02x}{color[1]:02x}{color[2]:02x}"
            print(f"Color: {hex_color}, Count: {count}")

analyze_png("c:/Users/ADMIN/Desktop/test-project/Finanza/public/img/logo.png")
