# start node server
node app.js &

# start streaming server
mjpg_streamer -i "/usr/lib/input_uvc.so -d /dev/video0  -r 640x480 -f 30" -o "/usr/lib/output_http.so -p 8090 -w /var/www/mjpg_streamer" && fg
