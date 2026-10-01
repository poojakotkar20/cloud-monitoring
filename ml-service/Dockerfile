FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
# Train model at build time
RUN cd model && python train_model.py
EXPOSE 5000
CMD ["python", "app.py"]
